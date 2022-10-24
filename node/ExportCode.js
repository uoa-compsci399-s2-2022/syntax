import { Node, nodeInputRule } from "@tiptap/core";

export const backtickInputRegex = /^```([a-z]+)?[\s\n]$/;
export const tildeInputRegex = /^~~~([a-z]+)?[\s\n]$/;

const langDict = {
	"c-clang": "C",
	"cpp-clang": "C++",
	"java-jdk": "Java",
	"javascript-node": "JavaScript",
	python3: "Python"
};

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
	addAttributes() {
		return {
			code_content: { default: "" },
			code_output: { default: "" },
			language: { default: "python3" },
		};
	},
	parseHTML() {
		return [
		  {
			tag: 'pre',
			preserveWhitespace: 'full',
		  },
		]
	},	
	renderHTML({ node }) {
		let output = ["div", {class:"output"},["pre",["code", node.attrs.code_output]]]
		console.log(output)
		return ['div', {class: "code"},
				['h3',langDict[node.attrs.language]],
				['pre',['code',{
					class: node.attrs.language
						? node.attrs.language
						: null,
					},
					node.attrs.code_content,
					],
				],
				['h5',"Output:"],
				output
				
		]
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