import { Node, nodeInputRule } from "@tiptap/core";
import { mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react";
import {Component, FC, ReactElement} from "react";
import ResizeableImage from "../components/ResizeableImage"
import { uploadImagePlugin, UploadFn } from "./upload_image";

/**
 * Tiptap Extension to upload images
 * @see  https://gist.github.com/slava-vishnyakov/16076dff1a77ddaca93c4bccd4ec4521#gistcomment-3744392
 * @since 7th July 2021
 *
 * Matches following attributes in Markdown-typed image: [, alt, src, title]
 *
 * Example:
 * ![Lorem](image.jpg) -> [, "Lorem", "image.jpg"]
 * ![](image.jpg "Ipsum") -> [, "", "image.jpg", "Ipsum"]
 * ![Lorem](image.jpg "Ipsum") -> [, "Lorem", "image.jpg", "Ipsum"]
 */

interface ImageOptions {
	inline: boolean;
	HTMLAttributes: Record<string, any>;
	useFigure: boolean
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		image: {
			/**
			 * Add an image
			 */
			setImage: (options: { src: string, alt?: string, title?: string, width?: string|number, height?: string|number, isDraggable?: boolean }) => ReturnType;
		};
	}
}

const IMAGE_INPUT_REGEX = /!\[(.+|:?)\]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;

export const TipTapCustomImage = (uploadFn: UploadFn) => {
	return Node.create<ImageOptions>({
		name: "image",
		inline() {
			return this.options.inline;
		},
		group() {
			return this.options.inline ? "inline" : "block";
		},
		draggable: true,
		useFigure: false,

		addAttributes() {
			return {
				src: {
					default: null,
				},
				alt: {
					default: null,
				},
				title: {
					default: null,
				},
				width: {
					default: 'auto',
					renderHTML: (attributes) => {
						return{
							width: attributes.width
						};
					}
				},
				height: {
					default: 'auto',
					renderHTML: (attributes) => {
						return {
							height: attributes.height
						};
					}
				},
				isDraggable: {
					default: true,
					renderHTML: (attributes) => {
						return {};
					},
				},
			};
		},
		parseHTML: () => [
			{
				tag: "img[src]",
				getAttrs: dom => {
					if (typeof dom === "string") return {};
					const element = dom as HTMLImageElement;

					const obj = {
						src: element.getAttribute("src"),
						title: element.getAttribute("title"),
						alt: element.getAttribute("alt"),
						width: element.getAttribute("width"),
						height: element.getAttribute("height"),
						isDraggable: element.getAttribute("isDraggable"),
					};
					return obj;
				},
			},
		],
		renderHTML: ({ HTMLAttributes }) => ["img", mergeAttributes(HTMLAttributes)],

		addCommands() {
			return {
				setImage:
					attrs =>
					({ state, dispatch }) => {
						const { selection } = state;
						const position = selection.$head ? selection.$head.pos : selection.$to.pos;

						const node = this.type.create(attrs);
						const transaction = state.tr.insert(position, node);
						return dispatch?.(transaction);
					},
				toggleResizable:
					() =>
					({ tr }) => {
						const { node } = tr?.selection;

						if (node?.type?.name === 'ResizableImage') {
							node.attrs.isDraggable = !node.attrs.isDraggable;
						}
					}
			};
		},
		
		addNodeView() {
			return ReactNodeViewRenderer(ResizeableImage)
		},

        addInputRules() {
            return [
                nodeInputRule({
                    find: IMAGE_INPUT_REGEX,
                    type: this.type,
                    getAttributes: match => {
                      const [,, alt, src, title, height, width, isDraggable] = match
            
                      return { src, alt, title, height, width, isDraggable }
                    },
                }),
            ];
        },
		addProseMirrorPlugins() {
			return [uploadImagePlugin(uploadFn)];
		},
	});
};