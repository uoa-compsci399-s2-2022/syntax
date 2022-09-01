import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Menubar from './Menubar.js'
import { Button } from '@nextui-org/react'
import { useEffect } from 'react';
import { useNote, useDispatchNote, useNotes, useDispatchNotes } from "../modules/AppContext";
import { useDebounce } from 'use-debounce';

export default function () {
  const notesc = useNotes();
  const setNotes = useDispatchNotes();

  const currentNote = useNote();
  const setCurrentNote = useDispatchNote();
  const editor = useEditor({
        extensions: [
      StarterKit,
    ],
    content: currentNote.body
  })

  const [debouncedEditor] = useDebounce(editor?.state.doc.content, 2000);

  const createNote = async () => {
    let note = {
      id: currentNote.id,
      title: currentNote.title,
      body: editor.getText(),
    };
    await fetch("/api/note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });
    setNotes({ note: note, type: "edit" });
  }
  useEffect(() => {
    if (debouncedEditor) {
      console.log(debouncedEditor);
    }
  }, [debouncedEditor]);

  return (
    <div>
      <label htmlFor="title">Title</label><br></br>
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
      <Button onClick={() => createNote()}>Save</Button>
    </div>
  )
}
