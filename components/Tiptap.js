import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from 'react';
import Menubar from "./Menubar.js";
import { Button, Spacer, Loading } from "@nextui-org/react";
import {
	useNote,
	useDispatchNote,
	useNotes,
	useDispatchNotes,
} from "../modules/AppContext";
import { TipTapCustomImage } from '../node/Image'
import { useState } from "react";
import { UploadFn } from '../node/upload_image'
import { debounce } from "lodash"

async function upload(file) {
	let res = await fetch("/api/s3/", {
		method: "POST",
		body: file.type,
	});
	const { url, src } = await res.json();
	await fetch(url, {
		method: "PUT",
		headers: {
			"Content-type": file.type,
			"Access-Control-Allow-Origin": "*",
		},
		body: file,
	});
	return src;
}

export default function ({ noteContent }) {
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
			body: content.json,
		};
		let res = await fetch("/api/note", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(note),
		});

		const updatedNote = await res.json();
		setNotes({ note: updatedNote, type: "edit" });
	}

	const editor = useEditor({
		extensions: [
			StarterKit,
			TipTapCustomImage(upload),
		],
		content: currentNote.body
	})
	editor?.on('update', ({ editor }) => {
		console.log("editor updated");
			debounceSave({
				id: currentNote.id,
				title: currentNote.title,
				json: editor.getJSON()
			});
	 })

	console.log("Editor Rendered", currentNote.id);

	useEffect(() => {
		editor?.commands?.setContent(currentNote.body);
	}, [editor, currentNote.body]);


	return (
		<div>
			<Menubar editor={editor} />
			<hr />
			<Spacer />
			<EditorContent editor={editor} key={currentNote} />
		</div>
	);
}
