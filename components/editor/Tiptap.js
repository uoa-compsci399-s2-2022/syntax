import { EditorContent, useEditor, BubbleMenu } from "@tiptap/react";

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


async function upload(file){
  //fetch data from endpoint for presigned link and image src
  let res = await fetch("/api/s3/", {
    method: "POST",
    body: file.type,
  });
  const {data, src, key} = await res.json();
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

async function uploadDrawing(files){
  let res = await fetch("/api/s3/", {
    method: "POST",
    body: "drawing",
  });
  const {data, src, key} = await res.json();
  const url = data.url; //url for post
  const fields = data.fields; //formdata for post
  const formData = new FormData();
  formData.append("key", `${key}.png`)
  Object.entries({ ...fields}).forEach(([key, value]) => {
    formData.append(key, value)
  })
  formData.append('file', files[0])
  //POST to upload file
  const png = await fetch(url, {
    method: "POST",
    body: formData,
  });
  if (png.ok){
    formData.set("key", `${key}.json`)
    formData.set("file", files[1])
    const content = await fetch(url, {
      method: "POST",
      body: formData,
    });
    return src+'.png'
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
    extensions: [
      StarterKit, 
      TipTapCustomImage(upload).configure({
        HTMLAttributes: {
          class: 'image'
        }
      }),
  ],
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

  const closeHandler = async (files) => {
    console.log(files)
    if (typeof files !== "undefined"){
      const src = await uploadDrawing(files)
      if (src !== null){
        editor.chain().focus()?.setImage({src})?.run();
      } else{
        console.log("File size was too large")
      }
    }
		setDrawModal(false)
	};

  const openHandler = () => {
    setDrawModal(true)
  }

  const imageMenu = (
    <>
      <Button onPress={() => editor.chain().focus().setImage({size: 'small'}).run()}
          className={editor?.isActive('image') ? 'is-active' : {size: 'small'}}>Small</Button>
      <Button onPress={() => editor.chain().focus().setImage({size: 'medium'}).run()}
          className={editor?.isActive('image') ? 'is-active' : {size: 'medium'}}>Medium</Button>
      <Button onPress={() => editor.chain().focus().setImage({size: 'large'}).run()}
          className={editor?.isActive('image') ? 'is-active' : {size: 'large'}}>Large</Button>
      <Button onPress={() => editor.chain().focus().setImage({float: 'left'}).run()}
          className={editor?.isActive('image') ? 'is-active' : {float: 'left'}}>Left</Button>
      <Button onPress={() => editor.chain().focus().setImage({float: 'none'}).run()}
          className={editor?.isActive('image') ? 'is-active' : {float: 'none'}}>No float</Button>
      <Button onPress={() => editor.chain().focus().setImage({float: 'right'}).run()}
          className={editor?.isActive('image') ? 'is-active' : {float: 'right'}}>Right</Button>
    </>
  )

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
      { editor && <BubbleMenu className="button-menu" editor={editor} tippyOptions={{duration: 100}} shouldShow={editor.isActive("image")}>
        <Button.Group className="is-active" color="primary" light>
          {imageMenu}
        </Button.Group>
      </BubbleMenu> }
      <EditorContent editor={editor} key={currentNote} style={{ "max-width": "100%" }} />
      <Spacer />
      <DrawingModal open={drawModal} closeHandler={closeHandler} />
    </Container>
  );
}
