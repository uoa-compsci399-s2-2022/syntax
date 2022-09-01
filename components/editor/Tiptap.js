import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Menubar from "./Menubar.js";
import { Button, Spacer } from "@nextui-org/react";
import {
  useNote,
  useDispatchNote,
  useNotes,
  useDispatchNotes,
} from "@/modules/AppContext";

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
  };

  return (
    <div>
      <Menubar editor={editor} />
      <hr />
      <Spacer />
      <EditorContent editor={editor} />
      <Spacer />
      <Button
        bordered
        onClick={() =>
          createNote(document.getElementById("title").value, editor.getText())
        }
      >
        Save
      </Button>
    </div>
  );
}
