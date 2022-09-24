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

const NoteList = ({ retrieved_notes, handleSidebarDisplay, createNote }) => {
	const router = useRouter();

	// this is where we assign the context to constants
	// which we will use to read and modify our global state
	const notes = useNotes();
	const setNotes = useDispatchNotes();

	const currentNote = useNote();
	const setCurrentNote = useDispatchNote();

	useEffect(() => {
		// replace notes in notes context state
		setNotes({ note: retrieved_notes, type: "replace" });
	}, [retrieved_notes]);
	
	const openNote = (note) => {
		note.action = "edit";
		setCurrentNote(note);
		router.push(`/note/${note.id}`, undefined, { shallow: true });
		// if width is below the 650px breakpoint, close the sidebar upon clicking a note
		if (window.innerWidth < 650) {
			handleSidebarDisplay();
		}
	};

	return (
		<>
			<Container css={{ padding: "0", textOverflow: "break" }}>
				{("groups" in retrieved_notes) ? (
					retrieved_notes.groups.map((key) => (
						<NoteGroup
							name={key.name}
							key={key.id}
							id={key.id}
							color={key.color}
							notes={key.notes}
							openNote={openNote}
							createNote={createNote}
						/>
					))
				) : (
					<div>
						<p>Oops.. no notes yet</p>
					</div>
				)}
			</Container>
		</>
	);
};

export default NoteList;
