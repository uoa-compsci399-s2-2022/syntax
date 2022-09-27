import {
	EditorContent, useEditor,
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
import { CodeBlockNode } from './CodeMirrorNode';

EditorView.prototype.updateState = function updateState(state) {
	if (!this.docView) return // This prevents the matchesNode error on hot reloads
	this.updateStateInner(state, this.state.plugins != state.plugins)
}
async function upload(file) {
	//fetch data from endpoint for presigned link and image src
	let res = await fetch("/api/s3/", {
		method: "POST",
		body: file.type
	});
	const { data, src } = await res.json();
	const url = data.url; //url for post
	const fields = data.fields; //formdata for post
	const formData = new FormData();
	Object.entries({ ...fields }).forEach(([key, value]) => {
		formData.append(key, value);
	});
	formData.append("file", file);
	console.log(form);
	//POST to upload file
	const upload = await fetch(url, {
		method: "POST",
		body: formData
	});
	if (upload.ok) {
		return src;
	}
	return null;
}

export default function () {
	const router = useRouter();
	const notesc = useNotes();
	const setNotes = useDispatchNotes();
	const currentNote = useNote();
	const setCurrentNote = useDispatchNote();
	const [file, setFile] = useState();
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
			TipTapCustomImage(upload)
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
      <Toolbar editor={editor} />
      <Spacer />
      <EditorContent
        editor={editor}
        key={currentNote}
        style={{ maxWidth: "100%" }}
      />
      <Spacer />
    </Container>
  );
}