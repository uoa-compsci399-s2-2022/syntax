import {
	Collapse,
	Text,
	Avatar,
	Container,
	Row,
	Col,
	Button,
	useTheme
} from "@nextui-org/react";
import { useState } from "react";
import {
	PlusIcon,
	ChevronDownIcon,
	ChevronRightIcon,
	EllipsisHorizontalIcon
} from "@heroicons/react/24/outline";
import { useNote } from "../../modules/AppContext";

const NoteGroup = ({ name, color = "white", notes, openNote, createNote }) => {
	const [isOpen, setIsOpen] = useState(false);
	const currentNote = useNote();
	const handleOpen = () => {
		setIsOpen((current) => !current);
	};

	return (
		<Container css={{ padding: "0", marginBottom: "0.5rem" }}>
			<Container
				display="flex"
				justify="space-between"
				alignItems="center"
				wrap="nowrap"
				onClick={handleOpen}
				css={{
					padding: "0.5rem",
					width: "100%",
					border: "none",
					textAlign: "left",
					outline: "none",
					cursor: "pointer",
					backgroundColor: "$accents4"
				}}
			>
				<Col
					css={{
						display: "flex",
						flex: "0",
						marginRight: "1rem"
					}}
				>
					{isOpen ? (
						<ChevronDownIcon style={{ height: "var(--icon-size-xs)" }} />
					) : (
						<ChevronRightIcon style={{ height: "var(--icon-size-xs)" }} />
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
					<Button
						light
						ripple={false}
						icon={<EllipsisHorizontalIcon style={{ height: "var(--icon-size-xs)" }} />}
						css={{
							cursor: "pointer",
							minWidth: "0",
							maxWidth: "var(--icon-size-xs)",
							height: "var(--icon-size-xs)",
							padding: "0.8rem",
							borderRadius: "var(--nextui-radii-sm)",
							"&:hover": {
								background: "$accents5"
							}
						}}
					/>
				</Col>
				<Col css={{ flex: "0" }}>
					<Button
						light
						ripple={false}
						onPress={() => createNote()}
						icon={<PlusIcon style={{ height: "var(--icon-size-xs)" }} />}
						css={{
							cursor: "pointer",
							minWidth: "0",
							maxWidth: "var(--icon-size-xs)",
							height: "var(--icon-size-xs)",
							padding: "0.8rem",
							borderRadius: "var(--nextui-radii-sm)",
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
					maxHeight: isOpen ? 34 * notes.length + "px" : "0"
				}}
			>
				<Container
					css={{
						padding: 0,
						backgroundColor: "$accents4"
					}}
				>
					{notes.map((note) => (
						<a
							key={note.id}
							onClick={() => {
								openNote(note);
							}}
						>
							<Row
								align="center"
								css={{
									display: "flex",
									padding: "0.3rem 0.5rem",
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
					))}
				</Container>
			</Container>
		</Container>
	);
};

export default NoteGroup;
