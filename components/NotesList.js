import { useEffect } from "react";
import Image from "next/image";


import { useNote, useDispatchNote, useNotes, useDispatchNotes } from "../modules/AppContext";
import Link from "next/link";

const NotesList = ({ retrieved_notes, showEditor }) => {
  // this is where we assign the context to constants
  // which we will use to read and modify our global state
  const notes = useNotes();
  const setNotes = useDispatchNotes();

  const currentNote = useNote();
  const setCurrentNote = useDispatchNote();

  // function to edit note by setting it to the currentNote state
  // and adding the "edit" action which will then be read by the <Editor /> component
  const editNote = (note) => {
    console.log({ note });
    note.action = "edit";
    setCurrentNote(note);
  };

  // function to delete note by using the setNotes Dispatch notes function
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
    // replace notes in notes context state
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