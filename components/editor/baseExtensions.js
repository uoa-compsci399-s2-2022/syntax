import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Youtube from "@tiptap/extension-youtube";
import {TrailingNode} from "./TrailingNode";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { TipTapCustomImage } from "@/node/Image";
import { Drawing } from "@/node/Drawing";
import { CodeBlockNode } from './CodeMirrorNode';
import { DebounceSave } from './DebounceSaveExtension';

export const baseExtensions = () => {
	return [
		StarterKit.configure({
			codeBlock: false,
			bulletList: false
		}),
		TrailingNode,
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
		Drawing().configure({
			HTMLAttributes: {
				class: 'drawing'
			}
		}),
		Placeholder.configure({
			placeholder: "Select a note or start typing here to get started..."
		})
	]
}