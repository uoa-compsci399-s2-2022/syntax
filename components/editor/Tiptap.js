import { EditorContent, useEditor,
	ReactNodeViewRenderer,
	NodeViewWrapper,
	NodeViewContent, } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState, useRef } from "react";
import Menubar from "./Menubar.js";
import { TipTapCustomImage } from "@/node/Image";
import { UploadFn } from "@/node/upload_image";
import { debounce } from "lodash";
import { Container, Button, Spacer } from "@nextui-org/react";
import {
  useNote,
  useDispatchNote,
  useNotes,
  useDispatchNotes
} from "@/modules/AppContext";


import Document from "@tiptap/extension-document";
// import CodeMirror from '@uiw/react-codemirror';
import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { Node, mergeAttributes, nodeInputRule } from "@tiptap/core";

import cypto from "crypto";
import { deflateRawSync, gunzipSync } from "zlib";

export const backtickInputRegex = /^```([a-z]+)?[\s\n]$/;
export const tildeInputRegex = /^~~~([a-z]+)?[\s\n]$/;

const SCRIPT_REGEX =
	/<script src="(\/static\/[0-9a-f]+-frontend\.js)" defer><\/script>/;
const RUNURL_REGEX = /^var runURL = "\/cgi-bin\/static\/([^"]+)";$/m;

/** Languages we can decide to support: Python3, Java(Oracle JDK), C(clang compiler), C++(clang compiler)*/
const LANGUAGES = ["python3", "java-jdk", "c-clang", "cpp-clang"];

async function getURL() {
	const num = await fetch("https://tio.run/").then((response) =>
		response.text()
	);
	const text = num.toString();
	const frontendJSURL = text.match(SCRIPT_REGEX)?.[1];

	const frontendJS = await fetch(`https://tio.run${frontendJSURL}`).then(
		(response) => response.text()
	);
	const string = frontendJS.toString();
	const runURL = string.match(RUNURL_REGEX)?.[1];

	return runURL;
}

function hex(size) {
	const randomHex = cypto.randomBytes(size).toString("hex");
	return randomHex;
}

export var TIO = {
	/** Returns a string array of the output, real time, user time, system time, cpu share and exit code*/
	run: async function run(code, input, language) {
		if (!LANGUAGES.includes(language)) {
			throw new Error(
				"Unsupported/Invalid language provided. TIO.languages for list of languages supported."
			);
		}
		const URL = await getURL();
		const hexadecimal = hex(16);
		const response = await fetch(
			`https://tio.run/cgi-bin/static/${URL}/${hexadecimal}`,
			{
				method: "POST",
				body: deflateRawSync(
					`Vlang\u00001\u0000${language}\u0000F.code.tio\u0000${code.length}\u0000${code}F.input.tio\u0000${input.length}\u0000${input}Vargs\u0000\u0000R`,
					{
						level: 9,
					}
				),
			}
		);

		const data = await response.arrayBuffer();
		const output = gunzipSync(new Buffer.from(data)).toString();
		const string = output.replaceAll(output.slice(-16), "").split("\n");
		return string;
	},
	languages: LANGUAGES,
};

const Extension = ({
	node: {
		attrs: { language: defaultLanguage, code_content: doc, code_output: result },
	},
	updateAttributes,
	extension,
}) => {
	const refEditor = useRef(null);
	const [language, setLanguage] = useState();
	const [input, setInput] = useState([]);
	const [code, setCode] = useState();
	const [output, setOutput] = useState(result);

	const run = async (event) => {
		// event.preventDefault();
		const compiled = await TIO.run(doc, input, "python3");
		updateAttributes({ code_output: compiled[0] })
		console.log(compiled);
	};

	const languageSelected = (event) => {
		const language = event.target.value;
		setLanguage(language);
	};

	const codeState = (event) => {
		const code = String(event.target.value);
		setCode(code);
	};

	const inputState = (event) => {
		const input = String(event.target.value);
		setInput(input);
	};

	// const codeList = output.map((line, index) => {
	// 	return <p key={line}>{line}</p>;
	// });

	useEffect(() => {
		const view = new EditorView({
			doc,
			extensions: [
				basicSetup,
				keymap.of([indentWithTab]),
				javascript(),
				EditorView.updateListener.of((v) => {
					if (v.docChanged) {
						updateAttributes({ code_content: v.state.doc.toString() });
					}
				}),
			],
			parent: refEditor.current,
		});
		return () => {
			view.destroy();
		};
	}, []);

	return (
		<NodeViewWrapper>
			<div className="maindiv">
				<refEditor ref={refEditor} contentEditable="true" />
				<button onClick={() => run()}>run</button>
				<div className="output">
					<span>{result}</span>
				</div>
			</div>
			{/* <CodeMirror
      value="console.log('hello world!');"
      extensions={[javascript({ jsx: true })]}
    /> */}
		</NodeViewWrapper>
	);
};

const CodeBlockNode = Node.create({
	name: "code_block",
	group: "block",
	code: true,
	defining: true,
	isolating: true,
	addAttributes() {
		return {
			code_content: { default: "" },
			code_output: { default: "" },
			language: { default: "js" },
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

async function upload(file) {
  let res = await fetch("/api/s3/", {
    method: "POST",
    body: file.type
  });
  const { url, src } = await res.json();
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-type": file.type,
      "Access-Control-Allow-Origin": "*"
    },
    body: file
  });
  return src;
}

export default function () {
  const notesc = useNotes();
  const setNotes = useDispatchNotes();
  const currentNote = useNote();
  const setCurrentNote = useDispatchNote();
  const [file, setFile] = useState();
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
    setNotes({ note: updatedNote, type: "edit" });
  };

  const editor = useEditor({
    extensions: [StarterKit.configure({
		codeBlock: false,
		code: false,
	}),
	CodeBlockNode,, TipTapCustomImage(upload)],
    content: currentNote.body
  });
  editor?.on("update", ({ editor }) => {
    console.log("editor updated");
    debounceSave({
      id: currentNote.id,
      title: currentNote.title,
      json: editor.getJSON()
    });
  });

  console.log("Editor Rendered", currentNote.id);

  useEffect(() => {
    editor?.commands?.setContent(currentNote.body);
  }, [editor, currentNote.body]);

  return (
    <Container
      display="flex"
      direction="column-reverse"
      css={{
        padding: "0",
        margin: "0",
        "min-width": "100%",
        "@xs": { "flex-direction": "column" }
      }}
    >
      <Menubar editor={editor} />
      <Spacer />
      <EditorContent editor={editor} key={currentNote} style={{ "max-width": "100%" }} />
      <Spacer />
    </Container>
  );
}
