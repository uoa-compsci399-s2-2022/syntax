import { Node, nodeInputRule } from "@tiptap/core";
import { mergeAttributes } from "@tiptap/react";
import { Plugin } from "prosemirror-state";

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
			 * Add a drawing or set it's attributes
			 */
			setDrawing: (options: { src: string, alt?: string, title?: string, size?: string, float?: string }) => ReturnType;
			/**
			 * Updates a drawing and deletes the prior version
			 */
			edtDrawing: (options: { src: string, alt?: string, title?: string }) => ReturnType;
		};
	}
}

const IMAGE_INPUT_REGEX = /!\[(.+|:?)\]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;

async function tag(drawing, Key, Value){
	const name = drawing.split(".com/").pop()
	const prefix = name.split(".")[0]
	const body = {
		tag: {
			key: Key,
			value: Value
		}
	}
	let resDraw = await fetch(`/api/s3/${prefix}.png`, {
		method: "PATCH",
		body: JSON.stringify(body)
	});	
	let resContent = await fetch(`/api/s3/${prefix}.json`, {
		method: "PATCH",
		body: JSON.stringify(body)
	});	
}

async function deleteDrawing(url){
	const name = url.split(".com/").pop()
	const prefix = name.split(".")[0]
	let resDraw = await fetch(`/api/s3/${prefix}.png`, {
	  method: "DELETE"
	})
	let resJson = await fetch(`/api/s3/${prefix}.json`, {
	  method: "DELETE"
	})
  }

async function uploadDrawing(files){
	let res = await fetch("/api/s3/", {
	  method: "POST",
	  body: "drawing",
	});
	const {data, src, key} = await res.json();
	const url = data.url; //url for post
	const fields = data.fields; //formdata for post
	const formData = new FormData();
	formData.append("key", `${key}.png`)
	Object.entries({ ...fields}).forEach(([key, value]) => {
	  formData.append(key, value as string)
	})
	formData.append('file', files[0])
	//POST to upload file
	const png = await fetch(url, {
	  method: "POST",
	  body: formData,
	});
	if (png.ok){
	  formData.set("key", `${key}.json`)
	  formData.set("file", files[1])
	  const content = await fetch(url, {
		method: "POST",
		body: formData,
	  });
	  return src+'.png'
	}
	return null
  }

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

			HTMLAttributes.class = ' image-' + node.attrs.size
			HTMLAttributes.class += ' image-float-' + node.attrs.float
	
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
						if (selection?.node?.type?.name == 'drawing'){
							return commands?.updateAttributes('drawing', attrs)
						}
						return commands?.insertContent({
							type: this.name,
							attrs: attrs
						});
					},
				editDrawing:
					attrs =>
					({ state, commands }) => {
						const { selection } = state;
						if (selection?.node?.type?.name == 'drawing'){
							deleteDrawing(selection?.node?.attrs?.src)
							return commands?.updateAttributes('drawing', attrs)
						} else {
							return commands?.insertContent({
								type: this.name,
								attrs: attrs
							})
						}
					}
			};
		},

		onTransaction(props){
			const before = props.transaction.before.toJSON().content.filter(node => (node.type === 'drawing')).map(element => element.attrs.src);
			const now = props.transaction.doc.content.toJSON().filter(node => (node.type === 'drawing')).map(element => element.attrs.src);
			if (before !== now){
				if (before.length > now.length){
					const difference = before.filter(drawing => !now.includes(drawing))
					difference.forEach(async drawing => {
						await tag(drawing, "USED", "False")
					})
				}
				else if (now.length >= before.length){
					const difference = now.filter(drawing => !before.includes(drawing));
             		difference.forEach(async drawing => {
						await tag(drawing, "USED", "True")
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

		addPasteRules(){
			return []
		},

		addProseMirrorPlugins() {
			return [new Plugin({
				props: {
					handlePaste(view, event, slice) {
						return false
					},
				}
			})];
		},
	});
};