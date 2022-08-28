import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Menubar from './Menubar.js'
import { Button } from '@nextui-org/react'
import { useNote, useDispatchNote, useNotes, useDispatchNotes } from "../modules/AppContext";

export default function () {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: '<p>Hello World! 🌎️</p>'
  })

  const setNotes = useDispatchNotes();

  const createNote = async (title, text) => {
    let note = {
      title: title,
      body: text,
    };
    await fetch("/api/note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });
    setNotes({ note: note, type: "add" });
  }

  return (
    <div>
      <label htmlFor="title">Title</label><br></br>
			<input type="text" id="title" name="title"></input><br></br>
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
      <Button onClick={() => createNote(document.getElementById("title").value, editor.getText())}>Save</Button>
    </div>
  )
}
