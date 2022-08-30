import NoteCard from "./NoteCard";
import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  useNote,
  useDispatchNote,
  useNotes,
  useDispatchNotes,
} from "../../modules/AppContext";

const NoteList = ({ retrieved_notes }) => {
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

  return (
    <div>
      {notes.length > 0 ? (
        <ul style={{ margin: "20px 0 20px 0" }}>
          {notes.map((note) => (
            <li key={note.id}>
              <a
                onClick={() => {
                  router.push(`/note/${note.id}`);
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
