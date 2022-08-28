import { useEffect } from "react";
import { useNote, useDispatchNote, useNotes, useDispatchNotes } from "../modules/AppContext";
import Link from "next/link";

const NotesList = ({ retrieved_notes }) => {

  const notes = useNotes();
  const setNotes = useDispatchNotes();
  const currentNote = useNote();
  const setCurrentNote = useDispatchNote();

  const editNote = (note) => {
    note.action = "edit";
    setCurrentNote(note);
  };

  const deleteNote = async (note) => {
    let confirmDelete = confirm("Do you really want to delete this note?");
    try {
      let res = await fetch(`/api/note`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      });
      const deletedNote = await res.json();
      confirmDelete ? setNotes({ note: deletedNote, type: "remove" }) : null;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setNotes({ note: retrieved_notes, type: "replace" });
  }, [retrieved_notes]);

  return (
    <div >
      {notes.length > 0 ? (
        <ul >
          {notes.map((note) => (
            <li key={note.id} >
              <article >
                <header >
                  <h2 >{note.title}</h2>
                </header>
                <main >
                  <p >{note.body}</p>
                </main>
                <footer >
                  <ul >
                    <li onClick={() => editNote(note)} >
                      <button >
                        <span >Edit</span>
                      </button>
                    </li>
                    <li >
                      <Link href={`/note/${note.id}`} target={`_blank`} rel={`noopener`}>
                        <button >
                          <span >Open</span>
                        </button>
                      </Link>
                    </li>
                    <li >
                      <button onClick={() => deleteNote(note)} >
                        <span >Delete</span>
                      </button>
                    </li>
                  </ul>
                </footer>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <div >
          <p>Oops.. no notes yet</p>
        </div>
      )}
    </div>
  );
};

export default NotesList;
