import {
	EditorContent, useEditor, BubbleMenu
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Youtube from "@tiptap/extension-youtube";
import Link from "@tiptap/extension-link";
import Toolbar from "./Toolbar.js";
import { TipTapCustomImage } from "@/node/Image";
import { Drawing } from "@/node/Drawing";
import { useRouter } from "next/router";
import { Container, Button, Spacer } from "@nextui-org/react";
import { EditorView } from 'prosemirror-view'
import {
	useNote,
	useDispatchNote,
	useDispatchNotes
} from "@/modules/AppContext";

import dynamic from 'next/dynamic'
import { CodeBlockNode } from './CodeMirrorNode';
import { DebounceSave } from './DebounceSaveExtension';
import getRandomColour from "../../hooks/getRandomColour"
import Collaboration from '@tiptap/extension-collaboration'
import { getSchema } from '@tiptap/core'
import * as Y from 'yjs'
import { prosemirrorJSONToYDoc, yDocToProsemirrorJSON } from 'y-prosemirror'
import { Room, WebrtcProvider } from 'y-webrtc'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { useSession } from "next-auth/react"
import { useEffect, useMemo, useState } from "react";
import { MdRoomService } from "react-icons/md";

EditorView.prototype.updateState = function updateState(state) {
	if (!this.docView) return // This prevents the matchesNode error on hot reloads
	this.updateStateInner(state, this.state.plugins != state.plugins)
}

const DrawingModal = dynamic(() => import('../editor/Tldraw'), {
	ssr: false,
})

async function uploadDrawing(files) {
	let res = await fetch("/api/s3/", {
		method: "POST",
		body: "drawing",
	});
	const { data, src, key } = await res.json();
	const url = data.url; //url for post
	const fields = data.fields; //formdata for post
	const formData = new FormData();
	formData.append("key", `${key}.png`)
	Object.entries({ ...fields }).forEach(([key, value]) => {
		formData.append(key, value)
	})
	formData.append('file', files[0])
	//POST to upload file
	const png = await fetch(url, {
		method: "POST",
		body: formData,
	});
	if (png.ok) {
		formData.set("key", `${key}.json`)
		formData.set("file", files[1])
		const content = await fetch(url, {
			method: "POST",
			body: formData,
		});
		return src + '.png'
	}
	return null
}

const getInitialUser = () => {
	return {
		name: "Loading...",
		color: getRandomColour()
	}
}

// const ydoc = new Y.Doc() //Must be outside to make sure users are using the same Y.js doc

export default function () {
	const currentNote = useNote();
	const [drawModal, setDrawModal] = useState(false);
	const [drawContent, setDrawContent] = useState(null);
	const [provider, setProvider] = useState(null);
	// const [ydoc, setYdoc] = useState(null);
	const [currentUser, setCurrentUser] = useState(getInitialUser)
	const { data: session, status } = useSession()

// if this is a Room, load the ydoc from rooms.id.ydoc
// otherwise load currentnote.body
// save for now only for owner. saves to room only. handle ydoc to regular note after removing all users
// ydoc handles crdt


// not sure useMemo is doing what we want performantly 

	const extensions = [
		StarterKit.configure({
			codeBlock: false,
			bulletList: false,
			history: false
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

		// DebounceSave().configure({
		// 	noteId: currentNote.id,
		// 	noteTitle: currentNote.title
		// }),
		TipTapCustomImage().configure({
			HTMLAttributes: {
				class: 'image'
			}
		}),
		Drawing().configure({
			HTMLAttributes: {
				class: 'drawing'
			}
		}),
	];

	// useEffect(() => {
	// 	var yDocRestore = new Y.Doc();
	// 	Y.applyUpdate(yDocRestore, currentNote.body);
	// 	return DocRestore;
	// }, []);

	// useEffect(() => {
	// 	var yDocRestore = new Y.Doc();
	// 	Y.applyUpdate(yDocRestore, currentNote.body);
	// 	setYdoc(yDocRestore);
	// 	var roomInit = new WebrtcProvider(currentNote.id, ydoc);
	// 	setProvider(roomInit);
	// }, []);
	const ydoc = useMemo(() => {
		// console.log(currentNote.body);
		const schema = getSchema(extensions)
		// console.log(schema);

		const predoc = prosemirrorJSONToYDoc(schema, currentNote.body, "default")
		console.log(yDocToProsemirrorJSON(predoc), predoc.getXmlFragment("default").toJSON());
		// const ydoc = new Y.Doc()
		// const newdoc = Y.encodeStateAsUpdate(predoc)
		// Y.applyUpdate(ydoc, newdoc)
		// console.log(ydoc, predoc, newdoc);
		return predoc;
	}, [currentNote.id]);

	// const ydoc = useMemo(() => {
	// 	var yDocRestore = new Y.Doc();
	// 	Y.applyUpdate(yDocRestore, currentNote.body);
	// 	return DocRestore;
	// }, []);

	const collabWebrtcProvider = useMemo(() => {
		return new WebrtcProvider(currentNote.id, ydoc);
	}, [currentNote.id, ydoc]);

	//Creates room based on note id. Deletes the old ydoc and creates a new blank one.
	// useEffect(() => {
	// 	if (typeof currentNote.id !== "undefined") {
	// 		if (provider !== null) {
	// 			provider.destroy()
	// 		}
	// 		setProvider(new WebrtcProvider(currentNote.id, ydoc))
	// 	}
	// }, [currentNote.id])

	const editor = useEditor({
		disablePasteRules: [Drawing, "drawing"],
		extensions: [
			...extensions,
			// Collaboration.configure({
			// 	document: ydoc,
			// }),
			// CollaborationCursor.configure({
			// 	provider: collabWebrtcProvider,
			// 	user: {
			// 		name: session?.user?.name,
			// 		color: getRandomColour(),
			// 	},
			// })
		],
		onDestroy() {
			// The editor is being destroyed.
			collabWebrtcProvider.destroy();
		},
		onCreate({ editor }) {
			// The editor is focused.
			console.log(editor.getJSON());
		},
		// this needs to be Ydoc
		content: currentNote.body
	}, [currentNote.id]);

	async function closeHandler(files) {
		if (typeof files !== "undefined") {
			if (typeof files[0] !== "undefined") {
				const src = await uploadDrawing(files)
				if (src === null) {
					console.log("File size was too large")
				} else if (drawContent === null) {
					editor.chain().focus()?.setDrawing({ src })?.run();
				}
				else {
					editor.chain().focus()?.editDrawing({ src })?.run();
				}
			}
		}
		setDrawModal(false)
		setDrawContent(null)
	};

	const editHandler = async (key) => {
		const res = await fetch(`/api/s3/${key}`, {
			method: "GET",
		})
		const body = await res.json()
		setDrawContent(body.file)
		setDrawModal(true)
	}

	const drawingOpenHandler = () => {
		setDrawModal(true)
	}


	// not sure this is needed, we can only ever have 1 user per sessions so just set the state
	//gets user's name
	// useEffect(() => {
	// 	setCurrentUser({ ...currentUser, session?.user.name })
	// }, [])

	// this needs to be changed or removed. if this is for an onUpdate, make a extension
	//updates the users name for awareness
	// useEffect(() => {
	// 	if (editor?.storage.collaborationCursor?.users && currentUser) {
	// 		localStorage.setItem('currentUser', JSON.stringify(currentUser))
	// 		editor.chain().focus().updateUser(currentUser)?.run()
	// 	}
	// }, [editor, currentUser])

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
			{editor && <BubbleMenu className="button-menu" pluginKey={"imageMenu"} editor={editor} tippyOptions={{ duration: 100 }} shouldShow={({ editor, view, state, oldState, from, to }) => {
				return editor?.isActive("image")
			}}>
				<Button.Group className="is-active" color="primary" light>
					<Button onPress={() => editor.chain().focus().updateImage({ size: 'small' }).run()}
						className={editor?.isActive('image') ? 'is-active' : { size: 'small' }}>Small</Button>
					<Button onPress={() => editor.chain().focus().updateImage({ size: 'medium' }).run()}
						className={editor?.isActive('image') ? 'is-active' : { size: 'medium' }}>Medium</Button>
					<Button onPress={() => editor.chain().focus().updateImage({ size: 'large' }).run()}
						className={editor?.isActive('image') ? 'is-active' : { size: 'large' }}>Large</Button>
					<Button onPress={() => editor.chain().focus().updateImage({ float: 'left' }).run()}
						className={editor?.isActive('image') ? 'is-active' : { float: 'left' }}>Left</Button>
					<Button onPress={() => editor.chain().focus().updateImage({ float: 'none' }).run()}
						className={editor?.isActive('image') ? 'is-active' : { float: 'none' }}>No float</Button>
					<Button onPress={() => editor.chain().focus().updateImage({ float: 'right' }).run()}
						className={editor?.isActive('image') ? 'is-active' : { float: 'right' }}>Right</Button>
				</Button.Group>
			</BubbleMenu>}
			{editor && <BubbleMenu className="button-menu" pluginKey={"drawingMenu"} editor={editor} tippyOptions={{ duration: 100 }} shouldShow={({ editor, view, state, oldState, from, to }) => {
				return editor?.isActive("drawing")
			}}>
				<Button.Group className="is-active" color="primary" light>
					<Button onPress={() => editor.chain().focus().setDrawing({ size: 'small' }).run()}
						className={editor?.isActive('drawing') ? 'is-active' : { size: 'small' }}>Small</Button>
					<Button onPress={() => editor.chain().focus().setDrawing({ size: 'medium' }).run()}
						className={editor?.isActive('drawing') ? 'is-active' : { size: 'medium' }}>Medium</Button>
					<Button onPress={() => editor.chain().focus().setDrawing({ size: 'large' }).run()}
						className={editor?.isActive('drawing') ? 'is-active' : { size: 'large' }}>Large</Button>
					<Button onPress={() => editor.chain().focus().setDrawing({ float: 'left' }).run()}
						className={editor?.isActive('drawing') ? 'is-active' : { float: 'left' }}>Left</Button>
					<Button onPress={() => editor.chain().focus().setDrawing({ float: 'none' }).run()}
						className={editor?.isActive('drawing') ? 'is-active' : { float: 'none' }}>No float</Button>
					<Button onPress={() => editor.chain().focus().setDrawing({ float: 'right' }).run()}
						className={editor?.isActive('drawing') ? 'is-active' : { float: 'right' }}>Right</Button>
					<Button onPress={() => editHandler(editor.state.selection.node.attrs.src.split(".com/")[1].split("png")[0] + "json")}
						className={editor?.isActive('drawing') ? 'is-active' : "editDrawing"}>Edit</Button>
				</Button.Group>
			</BubbleMenu>}
			<EditorContent editor={editor} style={{ "maxWidth": "100%" }} />
			<Spacer />
			<DrawingModal open={drawModal} closeHandler={closeHandler} content={drawContent} />
			<div>
				{/* <p>Users: {editor?.storage.collaborationCursor?.users.length} </p> */}
			</div>
		</Container>
	);
}