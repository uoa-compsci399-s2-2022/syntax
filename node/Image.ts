import { nodeInputRule } from "@tiptap/core";
import { mergeAttributes } from "@tiptap/react";
import { uploadImagePlugin } from "./upload_image";
import { Image } from "@tiptap/extension-image"


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

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		image: {
			/**
			 * Add an image
			 */
			setImage: (options: { src: string, alt?: string, title?: string }) => ReturnType;
		};
		customImage: {
			/**
			 * Add an image by URL
			 */
			setImageURL: (options: { src: string, alt?: string, title?: string }) => ReturnType;
			/**
			 * Add an image by file
			 */
			setImageFile: (options: { file: File, alt?: string, title?: string }) => ReturnType;
			/**
			 * Update an image's attributes
			 */
			updateImage: (options: { src?: string, alt?: string, title?: string, size?: string, float?: string }) => ReturnType;
		}
	}
}

const IMAGE_INPUT_REGEX = /!\[(.+|:?)\]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;
const sizeLimit = 5242880

/** Tag images with the key USED. If value is False then it will be deleted in 30 days. */
async function tag(image, Key, Value){
	if (typeof image === "string"){
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
}
	

/** upload images */
async function upload(file: File | Blob): Promise<string>{
	//fetch data from endpoint for presigned link and image src
	if (file.size > sizeLimit){
		throw Error("File size is too large")
	}
	let res = await fetch("/api/s3/", {
	  method: "POST",
	  body: file.type,
	});
	const {data, src, key} = await res.json();
	const url = data.url; //url for post
	const fields = data.fields; //formdata for post
	const formData = new FormData();
	Object.entries({ ...fields}).forEach(([key, value]) => {
	  formData.append(key, value as string)
	})
	formData.append('file', file)
	//POST to upload file
	const upload = await fetch(url, {
	  method: "POST",
	  body: formData,
	});
	if (upload.ok){
	  return src
	}
	return null
  }

async function getImage(src): Promise<string>{
		const res = await fetch(src)
		const blob = await res.blob()
		const url = await upload(blob)
		return url 	
}

export const TipTapCustomImage = () => {
	return Image.extend({
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
				setImageURL:
					attrs =>
					({ state, commands, dispatch }) => {
						const { selection } = state;
						if (selection?.node?.type?.name == 'image'){
							return commands?.updateAttributes('image', attrs)
						}
						const position = selection.$head ? selection.$head.pos : selection.$to.pos;
						const error = getImage(attrs.src).then((url) => {
							const attributes = {
								src: url,
								alt: attrs.alt,
								title: attrs.title
							}
							const node = this.type.create(attributes);
							const transaction = state.tr.insert(position, node);
							this.editor.view.dispatch(transaction)
						})				
					},
				updateImage:
					attrs =>
					({ state, commands }) => {
						const { selection } = state;
						if (selection?.node?.type?.name == 'image'){
							return commands?.updateAttributes('image', attrs)
						} else{
							return false
						}
					},

				setImageFile:
					attrs =>
					({state, commands}) => {
						const { selection } = state;
						if (selection?.node?.type?.name == 'image'){
							return commands?.updateAttributes('image', attrs)
						}
						const position = selection.$head ? selection.$head.pos : selection.$to.pos;

						upload(attrs.file).then((url) => {
							const attributes = {
								src: url,
								alt: attrs.alt,
								title: attrs.title
							}
							const node = this.type.create(attributes);
							const transaction = state.tr.insert(position, node);
							this.editor.view.dispatch(transaction)
						})
					}
			};
		},
		
		onTransaction(props){
			const before = props.transaction.before.toJSON().content.filter(node => (node.type === 'image')).map(element => element.attrs.src);
			const now = props.transaction.doc.content.toJSON().filter(node => (node.type === 'image')).map(element => element.attrs.src);
			if (before !== now){
				if (before.length > now.length){
					const difference = before.filter(image => !now.includes(image))
					difference.forEach(async image => {
						await tag(image, "USED", "False")
					})
				}
				else if (now.length >= before.length){
					const difference = now.filter(image => !before.includes(image));
             		difference.forEach(async image => {
						await tag(image, "USED", "True")
					})
				}
			}
		},

		addPasteRules() {
			return []
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
			return [uploadImagePlugin(upload)];
		},
	});
};