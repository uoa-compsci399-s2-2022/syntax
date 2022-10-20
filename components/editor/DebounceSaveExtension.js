import { Extension } from "@tiptap/core";
import { debounce } from "lodash";
import { useRef } from "react";
import { useRouter } from 'next/router';
import {
	useDispatchNotes
} from "@/modules/AppContext";
import { yDocToProsemirrorJSON, prosemirrorJSONToYDoc } from 'y-prosemirror'
import * as Y from 'yjs'
import { fromUint8Array, toUint8Array } from 'js-base64'

export const DebounceSave = () => {
	const router = useRouter();
	const setNotes = useDispatchNotes();
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
			YDOC: content.ydoc
		};
		let res = await fetch("/api/note", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(note)
		});

		const updatedNote = await res.json();
		if (!content.id) {
			router.push(`/note/${updatedNote.id}`, undefined, { shallow: true });
			setNotes({ note: updatedNote, type: "add" });
		} else {
			setNotes({ note: updatedNote, type: "edit" });
		}
	};

	return Extension.create({
		name: "debouncesave",
		addOptions() {
			return {
				noteTitle: undefined,
				noteId: undefined,
				YDOC: undefined,
			};
		},
		onBeforeCreate({ editor }) {
			if (this.options.noteId == undefined) console.warn("noteId not set");
		},
		onCreate({ editor }) {
			this.options.YDOC.on('update', function handler(update, origin) {
					// const yjson = prosemirrorJSONToYDoc(editor.schema, editor.getJSON());
					// const ut8arr = Y.encodeStateAsUpdate(yjson)
					// const ydocb64 = fromUint8Array(ut8arr);
					
					// console.log(yDocToProsemirrorJSON(this.options.ydoc));
					// debounceSave({
					// 	id: this.options.noteId,
					// 	title: this.options.noteTitle,
					// 	json: editor.getJSON(),
					// 	ydoc: ydocb64
					// });
					console.log(origin);
			 })
		},
		// onUpdate({ editor }) {
		// 	console.log("update", editor);
		// 	const yjson = prosemirrorJSONToYDoc(editor.schema, editor.getJSON());
		// 	const ut8arr = Y.encodeStateAsUpdate(yjson)
		// 	const ydocb64 = fromUint8Array(ut8arr);
			
		// 	// console.log(yDocToProsemirrorJSON(this.options.ydoc));
		// 	// debounceSave({
		// 	// 	id: this.options.noteId,
		// 	// 	title: this.options.noteTitle,
		// 	// 	json: editor.getJSON(),
		// 	// 	ydoc: ydocb64
		// 	// });
						
			
		// },
		// onTransaction({ editor, transaction }){
		// 	console.log("transaction", transaction);
		// },
		onDestroy() {
			console.log("destroy");
		}

	});
};
