import { Node, mergeAttributes, nodeInputRule } from "@tiptap/core";
import {
	ReactNodeViewRenderer
} from "@tiptap/react";
import { Extension } from './CodeMirrorExtension';

export const backtickInputRegex = /^```([a-z]+)?[\s\n]$/;
export const tildeInputRegex = /^~~~([a-z]+)?[\s\n]$/;

export const CodeBlockNode = Node.create({
	name: "code_block",
	group: "block",
	code: true,
	marks: '',
	defining: true,
	isolating: true,
	addAttributes() {
		return {
			code_content: { default: "" },
			code_output: { default: "" },
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