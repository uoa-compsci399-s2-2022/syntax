import { Dropdown, Container, Row, Col, Button } from "@nextui-org/react";
import DeleteModal from "@/components/modal/DeleteModal";
import GroupModal from "@/components/modal/GroupModal";
import { useState, useEffect } from "react";
import {
	PlusIcon,
	ChevronDownIcon,
	ChevronRightIcon,
	EllipsisHorizontalIcon,
	TrashIcon,
	PencilSquareIcon
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useNote, useDispatchNotes } from "@/modules/AppContext";

const NoteGroup = ({
	name,
	color = "#FFFFFF",
	notes,
	openNote,
	id,
	defaultGroup,
	createNote,
	shared = false
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedKey, setSelectedKey] = useState();
	const [groupModal, setGroupModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const currentNote = useNote();
	const setNotes = useDispatchNotes();
	const router = useRouter();

	useEffect(() => {
		if (id === currentNote.groupId) {
			setIsOpen(true);
		}
	}, [currentNote.groupId]);

	const openHandler = () => {
		setIsOpen((current) => !current);
	};

	const closeHandler = () => {
		setDeleteModal(false);
		setGroupModal(false);
		setSelectedKey();
	};

	const deleteGroupHandler = async () => {
		try {
			let res = await fetch(`/api/group`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(id)
			});
			const deletedGroup = await res.json();
			setNotes({ note: deletedGroup, type: "removeGroup" });
			router.push(
				`/note/${id != currentNote.groupId ? currentNote.groupId : ""}`,
				undefined,
				{
					shallow: true
				}
			);
			setDeleteModal(false);
		} catch (error) {
			console.log(error);
		}
	};

	const updateGroupHandler = (newName, newColor) => {
		const selectedName = newName && newName !== name ? newName : undefined;
		const selectedColor = newColor && newColor !== color ? newColor : undefined;

		if (selectedName || selectedColor) {
			updateGroup(selectedName, selectedColor);
		}
	};

	const updateGroup = async (newName = name, newColor = color) => {
		let res = await fetch("/api/group", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id, name: newName, color: newColor })
		});
		const updatedGroup = await res.json();
		setNotes({ note: updatedGroup, type: "editGroup" });
		router.push(`/note/${currentNote.id || ""}`, undefined, { shallow: true });
	};

	useEffect(() => {
		switch (selectedKey) {
			case "rename":
				setGroupModal(true);
				break;
			case "delete":
				setDeleteModal(true);
				break;
		}
	}, [selectedKey]);

	return (
		<Container
			css={{
				padding: "0",
				marginBottom: "0.5rem",
				borderRadius: "$md",
				background: "$accents4"
			}}
		>
			<Container
				display="flex"
				justify="space-between"
				alignItems="center"
				wrap="nowrap"
				onClick={notes.length > 0 ? openHandler : null}
				css={{
					padding: "0.5rem",
					width: "100%",
					border: "none",
					textAlign: "left",
					outline: "none",
					cursor: notes.length > 0 ? "pointer" : "auto",
					borderRadius: "$md",
					backgroundColor: notes.length > 0 ? "$accents4" : "$accents2"
				}}
			>
				<Col
					css={{
						display: "flex",
						flex: "0",
						marginRight: "1rem"
					}}
				>
					{isOpen && notes.length > 0 ? (
						<ChevronDownIcon style={{ height: "var(--icon-size-xs)" }} />
					) : (
						<ChevronRightIcon
							style={{
								height: "var(--icon-size-xs)",
								color:
									notes.length > 0
										? "var(--nextui-colors-text)"
										: "var(--nextui-colors-textDisabled)"
							}}
						/>
					)}
				</Col>
				<Col
					css={{
						fontWeight: "500",
						overflow: "hidden",
						whiteSpace: "nowrap",
						textOverflow: "ellipsis"
					}}
				>
					<svg height="10" width="10" style={{ marginRight: "0.8rem" }}>
						<circle cx="5" cy="5" r="5" fill={color} />
					</svg>
					{name}
				</Col>
				<Col css={{ flex: "0", marginLeft: "1rem" }}>
					<Dropdown>
						<Dropdown.Button
							light
							ripple={false}
							disabled={defaultGroup || shared ? true : false}
							icon={
								<EllipsisHorizontalIcon
									style={{ height: "var(--icon-size-xs)" }}
								/>
							}
							css={{
								minWidth: "0",
								maxWidth: "var(--icon-size-xs)",
								height: "var(--icon-size-xs)",
								padding: "0.8rem",
								borderRadius: "$sm",
								"&:hover": {
									background: "$accents5"
								}
							}}
						/>
						<Dropdown.Menu onAction={setSelectedKey} aria-label="Group Options">
							<Dropdown.Item
								key="rename"
								icon={
									<PencilSquareIcon style={{ height: "var(--icon-size-s)" }} />
								}
							>
								Edit
							</Dropdown.Item>
							<Dropdown.Item
								key="delete"
								color="error"
								icon={<TrashIcon style={{ height: "var(--icon-size-s)" }} />}
							>
								Delete
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</Col>
				<Col css={{ flex: "0" }}>
					<Button
						light
						ripple={false}
						disabled={shared ? true : false}
						onPress={() => {
							createNote(id);
							setIsOpen(true);
						}}
						icon={<PlusIcon style={{ height: "var(--icon-size-xs)" }} />}
						css={{
							minWidth: "0",
							maxWidth: "var(--icon-size-xs)",
							height: "var(--icon-size-xs)",
							padding: "0.8rem",
							borderRadius: "$sm",
							"&:hover": {
								background: "$accents5"
							}
						}}
					/>
				</Col>
			</Container>
			<Container
				css={{
					padding: "0",
					overflow: "hidden",
					transition: "max-height 0.3s",
					maxHeight: isOpen ? 40 * notes.length + "px" : "0"
				}}
			>
				<Container
					css={{
						padding: "0",
						marginBottom: "0.5rem",
						borderRadius: "$md",
						backgroundColor: "$accents4"
					}}
				>
					{notes.map((note) => (
						<Row
							css={{ padding: "0 0.5rem", marginBottom: "0.3rem" }}
							key={note.id}
						>
							<a
								onClick={() => {
									openNote(note);
								}}
								style={{ width: "100%" }}
							>
								<Row
									align="center"
									css={{
										padding: "0.3rem 0",
										width: "100%",
										borderRadius: "$md",
										backgroundColor:
											note.id === currentNote.id ? "$accents5" : "transparent",
										"&:hover": {
											background: "$accents5"
										}
									}}
								>
									<Col
										css={{
											minWidth: "var(--icon-size-xs)",
											flex: "0",
											marginRight: "1rem"
										}}
									></Col>
									<Col
										css={{
											whiteSpace: "nowrap",
											overflow: "hidden",
											textOverflow: "ellipsis",
											marginRight: "1rem"
										}}
									>
										{note.title}
									</Col>
								</Row>
							</a>
						</Row>
					))}
				</Container>
			</Container>
			<GroupModal
				open={groupModal}
				closeHandler={closeHandler}
				updateGroupHandler={updateGroupHandler}
				name={name}
				color={color}
			/>
			<DeleteModal
				open={deleteModal}
				closeHandler={closeHandler}
				deleteHandler={deleteGroupHandler}
				type="group"
			/>
		</Container>
	);
};

export default NoteGroup;
