import { Node, nodeInputRule } from "@tiptap/core";
import { mergeAttributes } from "@tiptap/react";
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
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		image: {
			/**
			 * Add an image
			 */
			setImage: (options: { src: string, alt?: string, title?: string }) => ReturnType;
		};
	}
}

const IMAGE_INPUT_REGEX = /!\[(.+|:?)\]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;

async function tag(image, Key, Value){
	const name = image.split(".com/").pop()
	const body = {
		tag: {
			key: Key,
			value: Value
		}
	}
	let res = await fetch(`/api/s3/${name}`, {
	method: "PATCH",
	body: JSON.stringify(body)
	});	
}

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

			HTMLAttributes.class = ' image-' + node.attrs.size
			HTMLAttributes.class += ' image-float-' + node.attrs.float
	
			return [
				'img',
				mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)
			]
		},

		addCommands() {
			return {
				setImage:
					attrs =>
					({ state, commands }) => {
						const { selection } = state;
						console.log(selection?.node?.type?.name == 'image')
						if (selection?.node?.type?.name == 'image'){
							return commands?.updateAttributes('image', attrs)
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
		
		onTransaction(props){
			const before = props.transaction.before.toJSON().content.filter(node => (node.type === 'image')).map(element => element.attrs.src);
			const now = props.transaction.doc.content.toJSON().filter(node => (node.type === 'image')).map(element => element.attrs.src);
			if (before !== now){
				if (before.length > now.length){
					const difference = before.filter(image => !now.includes(image))
					difference.forEach(async image => {
						console.log("image",image)
						await tag(image, "USED", "False")
					})
				}
				else if (now.length >= before.length){
					const difference = now.filter(image => !before.includes(image));
             		difference.forEach(async image => {
						console.log("image",image)
						await tag(image, "USED", "True")
					})
				}
			}
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
		addProseMirrorPlugins() {
			return [uploadImagePlugin(uploadFn)];
		},
	});
};