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

const NoteList = ({ retrieved_notes, groupName, groupColor }) => {
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
  };

  return (
    <>
      {notes.length > 0 ? (
        <Collapse.Group splitted divider={false} css={{ padding: "10px", "text-overflow": "break" }}>
          <NoteGroup name={groupName} notes={notes} color={groupColor} openNote={openNote} />
          <NoteGroup name={groupName} notes={notes} color={groupColor} openNote={openNote} />
          <NoteGroup name={groupName} notes={notes} color={groupColor} openNote={openNote} />
        </Collapse.Group>
      ) : (
        <div>
          <p>Oops.. no notes yet</p>
        </div>
      )}
    </>
  );
};

export default NoteList;
