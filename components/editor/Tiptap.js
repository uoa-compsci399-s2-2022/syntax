import { EditorContent, useEditor, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Youtube from "@tiptap/extension-youtube";
import Link from "@tiptap/extension-link";
import Toolbar from "./Toolbar.js";
import { TipTapCustomImage } from "../../node/Image";
import { Drawing } from "../../node/Drawing";
import { Container, Button, Spacer } from "@nextui-org/react";
import { EditorView } from "prosemirror-view";
import {
	useNote,
	useDispatchNote,
	useDispatchNotes
} from "@/modules/AppContext";
import { getSchema } from "@tiptap/core";
import dynamic from "next/dynamic";
import { CodeBlockNode } from "./CodeMirrorNode";
import { DebounceSave } from "./DebounceSaveExtension";
import getRandomColour from "../../hooks/getRandomColour";
import Collaboration from "@tiptap/extension-collaboration";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState, useMemo } from "react";
import { baseExtensions } from './baseExtensions';
import { fromBase64, fromUint8Array, toUint8Array } from 'js-base64'
import { yDocToProsemirrorJSON, prosemirrorJSONToYDoc } from 'y-prosemirror'
import { on } from "events";

EditorView.prototype.updateState = function updateState(state) {
	if (!this.docView) return; // This prevents the matchesNode error on hot reloads
	this.updateStateInner(state, this.state.plugins != state.plugins);
};

const DrawingModal = dynamic(() => import("../editor/Tldraw"), {
	ssr: false
});

async function upload(file) {
	//fetch data from endpoint for presigned link and image src
	let res = await fetch("/api/s3/", {
		method: "POST",
		body: file.type
	});
	const { data, src, key } = await res.json();
	const url = data.url; //url for post
	const fields = data.fields; //formdata for post
	const formData = new FormData();
	Object.entries({ ...fields }).forEach(([key, value]) => {
		formData.append(key, value);
	});
	formData.append("file", file);
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

async function uploadDrawing(files) {
	let res = await fetch("/api/s3/", {
		method: "POST",
		body: "drawing"
	});
	const { data, src, key } = await res.json();
	const url = data.url; //url for post
	const fields = data.fields; //formdata for post
	const formData = new FormData();
	formData.append("key", `${key}.png`);
	Object.entries({ ...fields }).forEach(([key, value]) => {
		formData.append(key, value);
	});
	formData.append("file", files[0]);
	//POST to upload file
	const png = await fetch(url, {
		method: "POST",
		body: formData
	});
	if (png.ok) {
		formData.set("key", `${key}.json`);
		formData.set("file", files[1]);
		const content = await fetch(url, {
			method: "POST",
			body: formData
		});
		return src + ".png";
	}
	return null;
}

const getInitialUser = () => {
	return {
		name: "Loading...",
		color: getRandomColour()
	};
};

export default function ({ setCollabUsers }) {
	const currentNote = useNote();
	const [drawModal, setDrawModal] = useState(false);
	const [drawContent, setDrawContent] = useState(null);
	// const [provider, setProvider] = useState(null);
	const [currentUser, setCurrentUser] = useState(getInitialUser);
	const { data: session, status } = useSession();

	//Creates room based on note id. Deletes the old ydoc and creates a new blank one.
	const ydoc = useMemo(() => new Y.Doc(), [currentNote.id]);
	const provider = useMemo(() => { if (currentNote.room) return new WebrtcProvider(currentNote.id + "_43785b3457gt", ydoc) }, [currentNote.room]);

	useEffect(() => {
		console.log(currentNote);
		if (currentNote.room == null) {
			console.log("shared note");
			provider?.destroy();
		}
	}, [currentNote.id]);

	const editor = useEditor(
		{
			disablePasteRules: [Drawing, "drawing"],
			extensions: [
				...baseExtensions(),
				TipTapCustomImage(upload).configure({
					HTMLAttributes: {
						class: 'image'
					}
				}),
				DebounceSave().configure({
					noteId: currentNote.id,
					noteTitle: currentNote.title,
					YDOC: ydoc
				}),
				Collaboration.configure({
					// document: ydoc,
					fragment: ydoc.getXmlFragment('prosemirror')
				}),
				"room" in currentNote && currentNote.room !== null
					? CollaborationCursor.configure({
						provider: provider,
						user: {
							name: session?.user?.name,
							color: getRandomColour(),
							image: session?.user?.image
						}
					})
					: null
			],
			onBeforeCreate({ editor }) {
				if(currentNote.YDOC) Y.applyUpdate(ydoc, toUint8Array(currentNote.YDOC));
				provider?.on('synced', synced => {
					const users = editor?.storage.collaborationCursor?.users;
					setCollabUsers(users);
				})
			},
			onDestroy() {
				provider?.destroy();
			},
			onCreate({editor}){
				const users = editor?.storage.collaborationCursor?.users;
				setCollabUsers(users);
			},
			...(currentNote.room == null ? { content: currentNote.body } : {})
		},
		[currentNote.id, provider]
	);

	async function closeHandler(files) {
		if (typeof files !== "undefined") {
			if (typeof files[0] !== "undefined") {
				const src = await uploadDrawing(files);
				if (src === null) {
					console.log("File size was too large");
				} else if (drawContent === null) {
					editor.chain().focus()?.setDrawing({ src })?.run();
				} else {
					editor.chain().focus()?.editDrawing({ src })?.run();
				}
			}
		}
		setDrawModal(false);
		setDrawContent(null);
	}

	const editHandler = async (key) => {
		const res = await fetch(`/api/s3/${key}`, {
			method: "GET"
		});
		const body = await res.json();
		setDrawContent(body.file);
		setDrawModal(true);
	};

	const drawingOpenHandler = () => {
		setDrawModal(true);
	};

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
			{editor && (
				<BubbleMenu
					className="button-menu"
					pluginKey={"imageMenu"}
					editor={editor}
					tippyOptions={{ duration: 100 }}
					shouldShow={({ editor, view, state, oldState, from, to }) => {
						return editor?.isActive("image");
					}}
				>
					<Button.Group className="is-active" color="primary" light>
						<Button
							onPress={() =>
								editor.chain().focus().updateImage({ size: "small" }).run()
							}
							className={
								editor?.isActive("image") ? "is-active" : { size: "small" }
							}
						>
							Small
						</Button>
						<Button
							onPress={() =>
								editor.chain().focus().updateImage({ size: "medium" }).run()
							}
							className={
								editor?.isActive("image") ? "is-active" : { size: "medium" }
							}
						>
							Medium
						</Button>
						<Button
							onPress={() =>
								editor.chain().focus().updateImage({ size: "large" }).run()
							}
							className={
								editor?.isActive("image") ? "is-active" : { size: "large" }
							}
						>
							Large
						</Button>
						<Button
							onPress={() =>
								editor.chain().focus().updateImage({ float: "left" }).run()
							}
							className={
								editor?.isActive("image") ? "is-active" : { float: "left" }
							}
						>
							Left
						</Button>
						<Button
							onPress={() =>
								editor.chain().focus().updateImage({ float: "none" }).run()
							}
							className={
								editor?.isActive("image") ? "is-active" : { float: "none" }
							}
						>
							No float
						</Button>
						<Button
							onPress={() =>
								editor.chain().focus().updateImage({ float: "right" }).run()
							}
							className={
								editor?.isActive("image") ? "is-active" : { float: "right" }
							}
						>
							Right
						</Button>
					</Button.Group>
				</BubbleMenu>
			)}
			{editor && (
				<BubbleMenu
					className="button-menu"
					pluginKey={"drawingMenu"}
					editor={editor}
					tippyOptions={{ duration: 100 }}
					shouldShow={({ editor, view, state, oldState, from, to }) => {
						return editor?.isActive("drawing");
					}}
				>
					<Button.Group className="is-active" color="primary" light>
						<Button
							onPress={() =>
								editor.chain().focus().setDrawing({ size: "small" }).run()
							}
							className={
								editor?.isActive("drawing") ? "is-active" : { size: "small" }
							}
						>
							Small
						</Button>
						<Button
							onPress={() =>
								editor.chain().focus().setDrawing({ size: "medium" }).run()
							}
							className={
								editor?.isActive("drawing") ? "is-active" : { size: "medium" }
							}
						>
							Medium
						</Button>
						<Button
							onPress={() =>
								editor.chain().focus().setDrawing({ size: "large" }).run()
							}
							className={
								editor?.isActive("drawing") ? "is-active" : { size: "large" }
							}
						>
							Large
						</Button>
						<Button
							onPress={() =>
								editor.chain().focus().setDrawing({ float: "left" }).run()
							}
							className={
								editor?.isActive("drawing") ? "is-active" : { float: "left" }
							}
						>
							Left
						</Button>
						<Button
							onPress={() =>
								editor.chain().focus().setDrawing({ float: "none" }).run()
							}
							className={
								editor?.isActive("drawing") ? "is-active" : { float: "none" }
							}
						>
							No float
						</Button>
						<Button
							onPress={() =>
								editor.chain().focus().setDrawing({ float: "right" }).run()
							}
							className={
								editor?.isActive("drawing") ? "is-active" : { float: "right" }
							}
						>
							Right
						</Button>
						<Button
							onPress={() =>
								editHandler(
									editor.state.selection.node.attrs.src
										.split(".com/")[1]
										.split("png")[0] + "json"
								)
							}
							className={
								editor?.isActive("drawing") ? "is-active" : "editDrawing"
							}
						>
							Edit
						</Button>
					</Button.Group>
				</BubbleMenu>
			)}
			<EditorContent editor={editor} style={{ maxWidth: "100%" }} />
			<Spacer />
			<DrawingModal
				open={drawModal}
				closeHandler={closeHandler}
				content={drawContent}
			/>
			<div>
				{/* <p>Users: {editor?.storage.collaborationCursor?.users.length} </p> */}
			</div>
		</Container>
	);
}