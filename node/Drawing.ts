import { Node, nodeInputRule } from "@tiptap/core";
import { mergeAttributes } from "@tiptap/react";

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
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		drawing: {
			/**
			 * Add an image
			 */
			setDrawing: (options: { src: string, alt?: string, title?: string }) => ReturnType;
		};
	}
}

const IMAGE_INPUT_REGEX = /!\[(.+|:?)\]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;



export const Drawing = () => {
	return Node.create<ImageOptions>({
		name: "drawing",
		inline() {
			return this.options.inline;
		},
		group() {
			return this.options.inline ? "inline" : "block";
		},
		draggable: true,

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
				size: {
					default: 'small',
					rendered: false
				},
				float: {
					default: 'none',
					rendered: false
				}
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
					};
					return obj;
				},
			},
		],

		renderHTML({ node, HTMLAttributes }) {

			HTMLAttributes.class = ' drawing-' + node.attrs.size
			HTMLAttributes.class += ' drawing-float-' + node.attrs.float
	
			return [
				'img',
				mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)
			]
		},

		addCommands() {
			return {
				setDrawing:
					attrs =>
					({ state, commands }) => {
						const { selection } = state;
						console.log(selection?.node?.type?.name == 'drawing')
						if (selection?.node?.type?.name == 'drawing'){
							return commands?.updateAttributes('drawing', attrs)
						}
						const position = selection.$head ? selection.$head.pos : selection.$to.pos;

						const node = this.type.create(attrs);

						return commands?.insertContent({
							type: this.name,
							attrs: attrs
						});
					},
			};
		},
		
        addInputRules() {
            return [
                nodeInputRule({
                    find: IMAGE_INPUT_REGEX,
                    type: this.type,
                    getAttributes: match => {
                      const [, alt, src, title] = match
            
                      return { src, alt, title }
                    },
                }),
            ];
        },
		//Plugin to be able to drag and drop images
	});
};