import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState, useRef } from "react";
import Menubar from "./Menubar.js";
import { TipTapCustomImage } from "@/node/Image";
import { UploadFn } from "@/node/upload_image";
import { debounce } from "lodash";
import { Container, Button, Spacer } from "@nextui-org/react";
import {
  useNote,
  useDispatchNote,
  useNotes,
  useDispatchNotes
} from "@/modules/AppContext";
import dynamic from 'next/dynamic'

const DrawingModal = dynamic(() => import('../editor/Tldraw'), {
  ssr: false,
})


async function upload(file, type=null){
  //fetch data from endpoint for presigned link and image src
  let res = await fetch("/api/s3/", {
    method: "POST",
    body: type === null ? file.type : type,
  });
  const {data, src} = await res.json();
  const url = data.url; //url for post
  const fields = data.fields; //formdata for post
  const formData = new FormData();
  Object.entries({ ...fields}).forEach(([key, value]) => {
    formData.append(key, value)
  })
  formData.append('file', file)
  //POST to upload file
  const upload = await fetch(url, {
    method: "POST",
    body: formData,
  });
  if (upload.ok){
    return src
  }
  return null
}

export default function () {
  if (typeof window === 'undefined'){
    return null;
  }
  const notesc = useNotes();
  const setNotes = useDispatchNotes();
  const currentNote = useNote();
  const setCurrentNote = useDispatchNote();
  const [drawModal, setDrawModal] = useState(false);
  const [drawResponse, setDrawResponse] = useState();
  const debounceSave = useRef(
    debounce(async (criteria) => {
      saveContent(criteria);
    }, 1000)
  ).current;

  const saveContent = async (content) => {
    console.log("editor debounce", content);
    let note = {
      id: content.id,
      title: content.title,
      body: content.json
    };
    let res = await fetch("/api/note", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note)
    });

    const updatedNote = await res.json();
    setNotes({ note: updatedNote, type: "edit" });
  };

  const editor = useEditor({
    extensions: [StarterKit, TipTapCustomImage(upload)],
    content: currentNote.body
  });
  editor?.on("update", ({ editor }) => {
    console.log("editor updated");
    debounceSave({
      id: currentNote.id,
      title: currentNote.title,
      json: editor.getJSON()
    });
  });

  console.log("Editor Rendered", currentNote.id);

  useEffect(() => {
    editor?.commands?.setContent(currentNote.body);
  }, [editor, currentNote.body]);

  const closeHandler = (result) => {
    console.log(result)
    if (typeof result !== "undefined"){
      if (result !== null){
        editor.chain().focus().setImage({result}).run();
      }
      else{
        console.log("File size was too large")
      }
    }
		setDrawModal(false)
	};

  const openHandler = () => {
    setDrawModal(true)
  }

  return (
    <Container
      display="flex"
      direction="column-reverse"
      css={{
        padding: "0",
        margin: "0",
        "min-width": "100%",
        "@xs": { "flex-direction": "column" }
      }}
    > 
      <Menubar editor={editor} openHandler={openHandler} />
      <Spacer />
      <EditorContent editor={editor} key={currentNote} style={{ "max-width": "100%" }} />
      <Spacer />
      {typeof window !== "undefined" ? <DrawingModal open={drawModal} closeHandler={closeHandler} upload={upload}/> : null}
    </Container>
  );
}
