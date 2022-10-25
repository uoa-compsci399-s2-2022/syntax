import NoteCard from "./NoteCard";
import NoteGroup from "@/components/note/NoteGroup";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Collapse, Container } from "@nextui-org/react";
import {
	useNote,
	useDispatchNote,
	useNotes,
	useDispatchNotes
} from "@/modules/AppContext";
import { useSession } from "next-auth/react";

const NoteList = ({ retrieved_notes, handleSidebarDisplay, createNote }) => {
	const router = useRouter();
	const { data: session, status } = useSession();
	// this is where we assign the context to constants
	// which we will use to read and modify our global state
	const notes = useNotes();
	const setNotes = useDispatchNotes();

	const setCurrentNote = useDispatchNote();

	// useEffect(() => {
	// 	// replace notes in notes context state
	// 	setNotes({ note: retrieved_notes, type: "replace" });
	// }, [retrieved_notes]);

	const openNote = (note) => {
		console.log(notes, note);
		note.action = "edit";
		setCurrentNote(note);
		router.push(`/note/${note.id}`);
		// if width is below the 650px breakpoint, close the sidebar upon clicking a note
		if (window.innerWidth < 650) {
			handleSidebarDisplay();
		}
	};
	return (
		<Container css={{ padding: "0 0.5rem", textOverflow: "break" }}>
			{"rooms" in notes ? (
				<NoteGroup
					name="Shared with me"
					key={notes.rooms.id}
					notes={notes?.rooms
						?.filter((note) => note?.userId != session?.user?.id)
						.map((note) => note.note)}
					openNote={openNote}
					createNote={createNote}
					shared={true}
				/>
			) : null}
			{"groups" in notes ? (
				notes.groups.map((group) => (
					<NoteGroup
						name={group.name}
						key={group.id}
						id={group.id}
						color={group.color}
						notes={group.notes}
						defaultGroup={group.default}
						openNote={openNote}
						createNote={createNote}
						shared={false}
					/>
				))
			) : (
				<div>
					<p>Oops... no notes yet</p>
				</div>
			)}
		</Container>
	);
};

export default NoteList;
