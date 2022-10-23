import ExportModal from "@/components/modal/ExportModal";
import DeleteModal from "@/components/modal/DeleteModal";
import ShareModal from "@/components/modal/ShareModal";
import AvatarGroup from "@/components/note/AvatarGroup";
import { Dropdown, Button, Navbar, useTheme } from "@nextui-org/react";
import { useTheme as useNextTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

import {
	EllipsisHorizontalIcon,
	TrashIcon,
	ShareIcon,
	LockClosedIcon,
	DocumentArrowUpIcon,
	ChevronDoubleRightIcon,
	ChevronDoubleLeftIcon,
	SunIcon,
	MoonIcon,
	ArrowLeftOnRectangleIcon
} from "@heroicons/react/24/solid";

import {
	useNote,
	useDispatchNote,
	useNotes,
	useDispatchNotes
} from "../../modules/AppContext";

const NoteNavbar = ({ sidebarDisplay, handleSidebarDisplay, collabUsers }) => {
	const { setTheme } = useNextTheme();
	const { checked, type } = useTheme();
	const router = useRouter();
	const [shareModal, setShareModal] = useState(false);
	const [selectedKey, setSelectedKey] = useState();
	const [exportModal, setExportModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const currentNote = useNote();
	const setNotes = useDispatchNotes();
	const { data: session, status } = useSession();

	const placeholderUserData = [
		{
			name: session?.user.name,
			email: session?.user.email,
			image: session?.user.image,
			owner: true
		},
		{ name: "Jane Doe", email: "jane.d@hotmail.com" },
		{ name: "Test User 1", email: "testtest123@gmail.com" },
		{ name: "Test User 2", email: "tu2@hotmail.com" },
		{ name: "Test User 3", email: "tu3@hotmail.com" },
		{ name: "Test User 4", email: "tu4@hotmail.com" },
		{ name: "Test User 5", email: "tu5@hotmail.com" },
		{ name: "Test User 6", email: "tu6@hotmail.com" },
		{
			name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec metus enim, sodales vel nisl vel, lobortis suscipit enim. Praesent scelerisque fringilla urna, at semper mi aliquam sed. Ut nec placerat nulla. Sed non odio vel dolor sodales maximus. Duis ut leo velit. Duis egestas nisi sit amet diam egestas, quis aliquam odio fermentum. Morbi eu ultrices felis.",
			color: "grey",
			email:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec metus enim, sodales vel nisl vel, lobortis suscipit enim. Praesent scelerisque fringilla urna, at semper mi aliquam sed. Ut nec placerat nulla. Sed non odio vel dolor sodales maximus. Duis ut leo velit. Duis egestas nisi sit amet diam egestas, quis aliquam odio fermentum. Morbi eu ultrices felis."
		}
	];

	const deleteNoteHandler = async () => {
		try {
			let res = await fetch(`/api/note`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(currentNote.id)
			});
			const deletedNote = await res.json();
			setNotes({ note: deletedNote, type: "remove" });
			router.push(`/note`, "/");
			setDeleteModal(false);
			setSelectedKey();
			
		} catch (error) {
			console.log(error);
		}
	};

	const exportNoteHandler = async (fileType) => {
		try {
			console.log(fileType);
			if (fileType == "HTML") {
				let res = await fetch(`/api/note/${currentNote.id}/export/html`, {
					method: "GET"
				});
				let { text } = await res.json();
				console.log(text);
				const blob = new Blob([text], { type: "text/html" });
				const link = document.createElement("a");
				link.href = URL.createObjectURL(blob);
				link.setAttribute("download", `${currentNote.title}.html`);
				link.click();
			} else if (fileType == "Markdown") {
				const res = await fetch(`/api/note/${currentNote.id}/export/md`, {
					method: "GET"
				});
				let { text } = await res.json();
				const blob = new Blob([text], { type: "text/markdown" });
				const link = document.createElement("a");
				link.href = URL.createObjectURL(blob);
				link.setAttribute("download", `${currentNote.title}.md`);
				link.click();
			} else if (fileType == "PDF") {
				let res = await fetch(`/api/note/${currentNote.id}/export/pdf`, {
					method: "GET"
				});
				const { text } = await res.json();
				const blob = await new Blob([Buffer.from(text)], {
					type: "application/pdf"
				});
				const link = document.createElement("a");
				link.href = URL.createObjectURL(blob);
				link.setAttribute("download", `${currentNote.title}.pdf`);
				link.click();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const shareHandler = async () => {
		router.push({
			pathname: `/room/${currentNote.id}`,
			query: { sharing: true },
			options: { shallow: true }
		});
		setShareModal(false);
	};

	const closeHandler = () => {
		setShareModal(false);
		setExportModal(false);
		setDeleteModal(false);
		setSelectedKey();
	};

	useEffect(() => {
		switch (selectedKey) {
			case "share":
				setShareModal(true);
				break;
			case "export":
				setExportModal(true);
				break;
			case "delete":
				setDeleteModal(true);
				break;
			case "changeTheme":
				type === "dark" ? setTheme("light") : setTheme("dark");
				setSelectedKey();
				break;
			case "signOut":
				signOut();
				setSelectedKey();
				break;
		}
	}, [selectedKey]);

	return (
		<Navbar
			variant="sticky"
			disableShadow
			disableBlur
			css={{ zIndex: 2 }}
			containerCss={{
				minWidth: "100%"
			}}
		>
			<Navbar.Content>
				<Navbar.Item css={{ display: "none", "@xs": { display: "flex" } }}>
					<Button
						auto
						light
						animated={false}
						onPress={handleSidebarDisplay}
						icon={
							sidebarDisplay ? (
								<ChevronDoubleRightIcon
									style={{ height: "var(--icon-size)" }}
								/>
							) : (
								<ChevronDoubleLeftIcon style={{ height: "var(--icon-size)" }} />
							)
						}
					/>
				</Navbar.Item>
				<Navbar.Item css={{ display: "flex", "@xs": { display: "none" } }}>
					<Button
						auto
						light
						animated={false}
						onPress={handleSidebarDisplay}
						icon={
							<ChevronDoubleLeftIcon style={{ height: "var(--icon-size)" }} />
						}
					>
						All Notes
					</Button>
				</Navbar.Item>
			</Navbar.Content>
			<Navbar.Content gap={5}>
				<Navbar.Item>
					<AvatarGroup
						users={collabUsers}
						setShareModal={setShareModal}
					/>
				</Navbar.Item>
				<Navbar.Item>
					<Dropdown placement="bottom-right">
						<Dropdown.Button
							light
							icon={<EllipsisHorizontalIcon style={{ height: "30px" }} />}
						/>
						<Dropdown.Menu
							disabledKeys={["lock"]}
							onAction={setSelectedKey}
							aria-label="Note Options"
						>
							<Dropdown.Section aria-label="Note Actions">
								<Dropdown.Item
									key="share"
									icon={<ShareIcon style={{ height: "var(--icon-size-s)" }} />}
								>
									Share
								</Dropdown.Item>
								<Dropdown.Item
									key="lock"
									icon={
										<LockClosedIcon style={{ height: "var(--icon-size-s)" }} />
									}
								>
									Lock
								</Dropdown.Item>
								<Dropdown.Item
									key="export"
									icon={
										<DocumentArrowUpIcon
											style={{ height: "var(--icon-size-s)" }}
										/>
									}
								>
									Export
								</Dropdown.Item>
								<Dropdown.Item
									key="delete"
									color="error"
									icon={<TrashIcon style={{ height: "var(--icon-size-s)" }} />}
								>
									Delete
								</Dropdown.Item>
							</Dropdown.Section>
							<Dropdown.Section aria-label="User Actions">
								<Dropdown.Item
									key="changeTheme"
									icon={
										type === "dark" ? (
											<SunIcon style={{ height: "var(--icon-size-s)" }} />
										) : (
											<MoonIcon style={{ height: "var(--icon-size-s)" }} />
										)
									}
								>
									{type === "dark" ? "Light" : "Dark"} mode
								</Dropdown.Item>
								<Dropdown.Item
									key="signOut"
									icon={
										<ArrowLeftOnRectangleIcon
											style={{ height: "var(--icon-size-s)" }}
										/>
									}
								>
									Sign out
								</Dropdown.Item>
							</Dropdown.Section>
						</Dropdown.Menu>
					</Dropdown>
				</Navbar.Item>
				<ExportModal
					open={exportModal}
					oncloseHandler={closeHandler}
					closeHandler={exportNoteHandler}
				/>
				<ShareModal
					open={shareModal}
					closeHandler={closeHandler}
					shareHandler={shareHandler}
					users={placeholderUserData}
				/>
				<DeleteModal
					open={deleteModal}
					onclosehandler={closeHandler}
					closeHandler={deleteNoteHandler}/>
			</Navbar.Content>
		</Navbar>
	);
};

export default NoteNavbar;
