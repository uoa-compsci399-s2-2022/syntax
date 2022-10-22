import { Node, mergeAttributes, nodeInputRule } from "@tiptap/core";
import {
	ReactNodeViewRenderer
} from "@tiptap/react";
import { Extension } from './CodeMirrorExtension';
import { Selection } from "prosemirror-state"

export const backtickInputRegex = /^```([a-z]+)?[\s\n]$/;
export const tildeInputRegex = /^~~~([a-z]+)?[\s\n]$/;

export const CodeBlockNode = Node.create({
	name: "code_block",
	group: "block",
	code: true,
	content: "text*",
	marks: '',
	defining: true,
	isolating: true,
	addOptions() {
		return {
			exitOnTripleEnter: true,
			exitOnArrowDown: true,
			HTMLAttributes: {},
		}
	},
	addCommands() {
		return {
			insertCodeBlock: attributes => ({ commands }) => {
				commands.clearNodes();
				return commands.insertContent({
					type: this.name,
				});
			},
			arrowHandler: (dir) => ({ state, view }) => {
				const dispatch = view.dispatch;
				return (editor) => {
					if (state.selection.empty && view.endOfTextblock(dir)) {
						const side = dir === "left" || dir === "up" ? -1 : 1;
						const $head = state.selection.$head;
						const nextPos = Selection.near(
							state.doc.resolve(side > 0 ? $head.after() : $head.before()),
							side
						);

						if (nextPos.node?.type.name === "code_block") {
							dispatch(state.tr.setSelection(nextPos));
							return true;
						}
					};
				}
			},
			setSelection(anchor, head) {
				let dir = anchor > this.getPos() ? 1 : -1;
			},
		}
	},
	addKeyboardShortcuts() {
		return {
			"ArrowLeft": () => this.editor.commands.arrowHandler("left")(this.editor),
			"ArrowRight": () => this.editor.commands.arrowHandler("right")(this.editor),
			"ArrowUp": () => this.editor.commands.arrowHandler("up")(this.editor),
			"ArrowDown": () => this.editor.commands.arrowHandler("down")(this.editor),
		}
	},

	addAttributes() {
		return {
			code_content: { default: "" },
			code_output: { default: "" },
			system_output: {default: ""},
			language: { default: "python3" },
		};
	},
	parseHTML() {
		return [{ tag: "code_block" }];
	},
	renderHTML({ HTMLAttributes }) {
		return ["code_block", mergeAttributes(HTMLAttributes)];
	},
	addNodeView() {
		return ReactNodeViewRenderer(Extension);
	},
	addInputRules() {
		return [
			nodeInputRule({
				find: backtickInputRegex,
				type: this.type,
				getAttributes: (match) => ({
					language: match[1],
				}),
			}),
		];
	},
});