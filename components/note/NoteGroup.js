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
import { useNote, useNotes } from "../../modules/AppContext";

const NoteGroup = ({ name, color = "white", notes, openNote, id, createNote }) => {
	const notesc = useNotes();
  const [isOpen, setIsOpen] = useState(false);
  const { checked, type } = useTheme();
  const currentNote = useNote();
  const handleOpen = () => {
    setIsOpen((current) => !current);
  };

	return (
		<Container
			css={{
				padding: "0",
				marginBottom: "0.5rem",
				borderRadius: "var(--nextui-radii-md)",
				background: "$accents4"
			}}
		>
			<Container
				display="flex"
				justify="space-between"
				alignItems="center"
				wrap="nowrap"
				onClick={notes.length > 0 ? handleOpen : null}
				css={{
					padding: "0.5rem",
					width: "100%",
					border: "none",
					textAlign: "left",
					outline: "none",
					cursor: notes.length > 0 ? "pointer" : "auto",
					borderRadius: "var(--nextui-radii-md)",
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
					{isOpen ? (
						<ChevronDownIcon style={{ height: "var(--icon-size-xs)" }} />
					) : (
						<ChevronRightIcon style={{ height: "var(--icon-size-xs)", color: notes.length > 0 ? "$text" : "grey" }} />
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
						onPress={() => createNote(id)}
						icon={<PlusIcon style={{ height: "var(--icon-size-xs)" }} />}
						css={{
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
					maxHeight: isOpen ? 40 * notes.length + "px" : "0"
				}}
			>
				<Container
					css={{
						padding: "0",
						marginBottom: "0.5rem",
						borderRadius: "var(--nextui-radii-md)",
						backgroundColor: "$accents4"
					}}
				>
					{notes.map((note) => (
						<Row css={{padding: "0 0.5rem", marginBottom: "0.3rem"}} key={note.id}>
						<a
							
							onClick={() => {
								openNote(note);
							}}
							style={{width: "100%"}}
						>
							<Row
								align="center"
								css={{
									padding: "0.3rem 0",
									width: "100%",
									borderRadius: "var(--nextui-radii-md)",
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
		</Container>
	);
};

export default NoteGroup;
