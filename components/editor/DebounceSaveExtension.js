import { Extension } from "@tiptap/core";
import { debounce } from "lodash";
import { useRef } from "react";
import { useRouter } from 'next/router';
import {
	useDispatchNotes
} from "@/modules/AppContext";


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
			};
		},
		onBeforeCreate({ editor }) {
			if (this.options.noteId == undefined) console.log("noteId not set");
		},
		// onCreate({ editor }) {
		// 	console.log("create");
		// },
		onUpdate({ editor }) {
			debounceSave({
				id: this.options.noteId,
				title: this.options.noteTitle,
				json: editor.getJSON()
			});
		},
		onDestroy() {
			console.log("destroy");
		},
	});
};
