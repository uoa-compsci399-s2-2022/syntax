import NoteCard from "./NoteCard";
import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  useNote,
  useDispatchNote,
  useNotes,
  useDispatchNotes,
} from "@/modules/AppContext";

const NoteList = ({ retrieved_notes, handleSidebarDisplay }) => {
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
    <div>
      {notes.length > 0 ? (
        <ul style={{ margin: "20px 0 20px 0" }}>
          {notes.map((note) => (
            <li key={note.id} style={{ marginBottom: "20px" }}>
              <a
                onClick={() => {
                  openNote(note);
                }}
              >
                <NoteCard note={note} />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <p>Oops.. no notes yet</p>
        </div>
      )}
    </div>
  );
};

export default NoteList;
