import {
	EditorContent, useEditor, BubbleMenu,
	ReactNodeViewRenderer,
	NodeViewWrapper,
	NodeViewContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Youtube from "@tiptap/extension-youtube";
import Link from "@tiptap/extension-link";
import { useEffect, useState, useRef } from "react";
import Toolbar from "./Toolbar.js";
import { TipTapCustomImage } from "@/node/Image";

import { Drawing } from "@/node/Drawing";
import { Extension } from '@tiptap/core'
import { UploadFn } from "@/node/upload_image";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import { Container, Button, Spacer } from "@nextui-org/react";
import { EditorView } from 'prosemirror-view'
import {
	useNote,
	useDispatchNote,
	useNotes,
	useDispatchNotes
} from "@/modules/AppContext";

import dynamic from 'next/dynamic'
import { CodeBlockNode } from './CodeMirrorNode';


EditorView.prototype.updateState = function updateState(state) {
	if (!this.docView) return // This prevents the matchesNode error on hot reloads
	this.updateStateInner(state, this.state.plugins != state.plugins)
}

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

async function updateDrawing(files){
  try{
    const key = files[2].split(".")[0]
    console.log(key)
    let res = await fetch(`/api/s3/${key}`, {
      method: "PUT",
    });
    const {data, src} = await res.json();
    console.log(data)
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
      await fetch(src + ".png", {cache: 'reload', mode: 'no-cors'})
      return src + ".png"
    }
    return null
  }
  catch (err){
    return null
  }
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
  const [drawContent, setDrawContent] = useState(null);
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
		if (!content.id) {
			router.push(`/note/${updatedNote.id}`, undefined, { shallow: true });
			setCurrentNote(updatedNote);
		}
		setNotes({ note: updatedNote, type: "edit" });
	};

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				codeBlock: false,
				code: false,
				bulletList: false
			}),
			Underline,
			Superscript,
			Subscript,
			Youtube,
			BulletList.configure({
				HTMLAttributes: {
					class: "editor-ul"
				}
			}),
			Link.configure({
				HTMLAttributes: {
					class: "editor-link"
				}
			}),
			CodeBlockNode,
      TipTapCustomImage(upload).configure({
        HTMLAttributes: {
          class: 'image'
        }
      }),
      Drawing().configure({
        HTMLAttributes: {
          class: 'drawing'
        }
      })
		],
		content: currentNote.body
	});
	editor?.on("update", ({ editor }) => {
		// console.log("editor updated");
		debounceSave({
			id: currentNote.id,
			title: currentNote.title,
			json: editor.getJSON()
		});
	});

	useEffect(() => {
		editor?.commands?.setContent(currentNote.body);
	}, [currentNote.body]);


  const closeHandler = async (files) => {
    if (typeof files !== "undefined"){
      let src
      if (drawContent !== null){
        src = await updateDrawing(files)
      } else {
        src = await uploadDrawing(files)
      }
      if (src === null) {
        console.log("File size was too large")
      }
      editor.chain().focus()?.setDrawing({src})?.run();
    }
		setDrawModal(false)
    setDrawContent(null)
	};

  const editHandler = async (key) => {
    const res = await fetch(`/api/s3/${key}`,{
      method: "GET",
    })
    const body = await res.json()
    setDrawContent([body.file, key])
    setDrawModal(true)
  }

  const drawingOpenHandler = () => {
    setDrawModal(true)
  }
    
  return (
    <Container
      display="flex"
      direction="column-reverse"
      css={{
        padding: "0",
        margin: "0",
        minWidth: "100%",
        "@xs": { "flex-direction": "column" }
      }}
    > 
      <Toolbar editor={editor} drawingOpenHandler={drawingOpenHandler} />
      <Spacer />
      {editor && <BubbleMenu className="button-menu" pluginKey={"imageMenu"} editor={editor} tippyOptions={{duration: 100}} shouldShow={({ editor, view, state, oldState, from, to }) => {
        return editor?.isActive("image")}}>
        <Button.Group className="is-active" color="primary" light>
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
        </Button.Group>
      </BubbleMenu>}
      {editor && <BubbleMenu className="button-menu" pluginKey={"drawingMenu"} editor={editor} tippyOptions={{duration: 100}} shouldShow={({ editor, view, state, oldState, from, to }) => {
        return editor?.isActive("drawing")}}>
        <Button.Group className="is-active" color="primary" light>
          <Button onPress={() => editor.chain().focus().setDrawing({size: 'small'}).run()}
              className={editor?.isActive('drawing') ? 'is-active' : {size: 'small'}}>Small</Button>
          <Button onPress={() => editor.chain().focus().setDrawing({size: 'medium'}).run()}
              className={editor?.isActive('drawing') ? 'is-active' : {size: 'medium'}}>Medium</Button>
          <Button onPress={() => editor.chain().focus().setDrawing({size: 'large'}).run()}
              className={editor?.isActive('drawing') ? 'is-active' : {size: 'large'}}>Large</Button>
          <Button onPress={() => editor.chain().focus().setDrawing({float: 'left'}).run()}
              className={editor?.isActive('drawing') ? 'is-active' : {float: 'left'}}>Left</Button>
          <Button onPress={() => editor.chain().focus().setDrawing({float: 'none'}).run()}
              className={editor?.isActive('drawing') ? 'is-active' : {float: 'none'}}>No float</Button>
          <Button onPress={() => editor.chain().focus().setDrawing({float: 'right'}).run()}
              className={editor?.isActive('drawing') ? 'is-active' : {float: 'right'}}>Right</Button>
          <Button onPress={() => editHandler(editor.state.selection.node.attrs.src.split(".com/")[1].split("png")[0]+"json")}
              className={editor?.isActive('drawing') ? 'is-active' : "getJson" }>Edit</Button>
        </Button.Group>
      </BubbleMenu>}
      <EditorContent editor={editor} key={currentNote} style={{ "max-width": "100%" }} />
      <Spacer />
      <DrawingModal open={drawModal} closeHandler={closeHandler} content={drawContent}/>
    </Container>
  );
}