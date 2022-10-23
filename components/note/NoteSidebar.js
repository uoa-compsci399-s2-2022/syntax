import NoteList from "./NoteList";
import SearchModal from "@/components/modal/SearchModal";
import { useState, useEffect } from "react";
import { Container, Button, Row, useTheme, Input } from "@nextui-org/react";
import {
	MagnifyingGlassIcon,
	PlusIcon,
	ChevronDoubleRightIcon,
	FolderPlusIcon,
	DocumentPlusIcon
} from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import {
	useNote,
	useDispatchNote,
	useNotes,
	useDispatchNotes
} from "../../modules/AppContext";
import { NoteTemplate } from "./NewNote";

const NoteSidebar = ({ sidebarDisplay, handleSidebarDisplay }) => {
	const { checked, type } = useTheme();
	const [searchModal, setSearchModal] = useState(false);
	const router = useRouter();
	const currentNote = useNote();
	const setCurrentNote = useDispatchNote();
	const noteslist = useNotes();
	const setNotes = useDispatchNotes();

	const createNote = async (id = undefined) => {
		let res = await fetch("/api/note", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ...NoteTemplate, ...{ groupId: id } })
		});

		const newNote = await res.json();
		console.log("Create successful", { newNote });
		setCurrentNote(newNote);
		setNotes({ note: newNote, type: "add" });
		router.push(`/note/${newNote.id}`, undefined, { shallow: true });
	};

	const createGroup = async () => {
		let res = await fetch("/api/group", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: "Untitled", color: "#ffffff" })
		});

		const newGroup = await res.json();
		console.log("Create successful", { newGroup });
		newGroup.notes = [];
		setNotes({ note: newGroup, type: "addGroup" });
		router.push(`/note/${currentNote.id || ""}`, undefined, { shallow: true });
	};

	const closeModalHandler = (searched) => {
		setSearchModal(false);
		if (searched && window.innerWidth < 650) {
			handleSidebarDisplay();
		}
	};

	return (
		<Container
			display="flex"
			wrap="nowrap"
			direction="column"
			css={{
				position: "absolute",
				zIndex: 3,
				width: "100vw",
				transition: "transform 0.2s ease-in-out",
				transform: sidebarDisplay ? "translateX(-101%)" : "translateX(0%)",
				padding: "0",
				margin: "0",
				background: "$accents0",
				height: "100vh",
				float: "left",
				color: type === "light" ? "$textSecondary" : "$text",
				"@xs": {
					position: sidebarDisplay ? "fixed" : "relative",
					maxWidth: "15%",
					minWidth: "250px"
				}
			}}
		>
			<Row css={{ padding: "20px 10px" }}>
				<Button
					auto
					icon={
						<MagnifyingGlassIcon style={{ height: "var(--icon-size-s)" }} />
					}
					onPress={setSearchModal}
					css={{
						width: "100%",
						color: "$textSecondary",
						background: "$background",
						justifyContent: "flex-start"
					}}
				>
					Search notes
				</Button>
				<Button
					auto
					light
					animated={false}
					onPress={handleSidebarDisplay}
					icon={
						<ChevronDoubleRightIcon style={{ height: "var(--icon-size)" }} />
					}
					css={{ display: "flex", "@xs": { display: "none" } }}
				/>
			</Row>
			<Container
				css={{
					overflowY: "auto",
					overflowX: "hidden",
					padding: "0",
					height: "100%"
				}}
			>
				<NoteList
					retrieved_notes={noteslist}
					showEditor={undefined}
					handleSidebarDisplay={handleSidebarDisplay}
					createNote={createNote}
				/>
			</Container>

			<Container
				display="flex"
				wrap="nowrap"
				css={{ padding: "20px 10px", gap: "10px" }}
			>
				<Button
					auto
					icon={<DocumentPlusIcon style={{ height: "var(--icon-size-s)" }} />}
					onPress={() => createNote()}
					css={{
						minWidth: "0",
						flex: "1",
						background: "$accents4",
						color: "$textSecondary"
					}}
				>
					Note
				</Button>

				<Button
					auto
					icon={<FolderPlusIcon style={{ height: "var(--icon-size-s)" }} />}
					onPress={() => createGroup()}
					css={{
						minWidth: "0",
						flex: "1",
						background: "$accents4",
						color: "$textSecondary"
					}}
				>
					Group
				</Button>
			</Container>
			<SearchModal open={searchModal} closeHandler={closeModalHandler} />
		</Container>
	);
};

export default NoteSidebar;
