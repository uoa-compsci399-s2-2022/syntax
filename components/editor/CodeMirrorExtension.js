import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { StreamLanguage } from "@codemirror/language";
import { useEffect, useState, useRef } from "react";
import {
	useTheme,
	Button,
	Spacer,
	Dropdown,
	Container,
	Row
} from "@nextui-org/react";
import { NodeViewWrapper } from "@tiptap/react";
import { TIO, LANGUAGES as TioLanguages } from "@/node/tio";
import { oneDark, color as oneDarkColors } from "@codemirror/theme-one-dark";
import { tomorrow } from "thememirror";

const themeExtensions = {
	light: [tomorrow],
	dark: [oneDark]
};

export const Extension = ({
	node: {
		attrs: {
			language: lang,
			code_content: doc,
			code_output: result,
			system_output: time
		}
	},
	updateAttributes,
	extension
}) => {
	const refEditor = useRef(null);
	const [language, setLanguage] = useState();
	const [input, setInput] = useState([]);
	const [codeOutputOpen, setCodeOutputOpen] = useState(false);
	const [systemInfo, setSystemInfo] = useState(time == "" ? true : false);
	const { checked, type } = useTheme();

	const langDict = {
		"c-clang": "C",
		"cpp-clang": "C++",
		"java-jdk": "Java",
		"javascript-node": "JavaScript",
		python3: "Python"
	};

	const run = async (event) => {
		const compiled = await TIO.run(doc, input, lang);
		const output = compiled.slice(0, compiled.length - 5).join("\n");
		const system = compiled.slice(compiled.length - 5).join("\n");
		updateAttributes({ code_output: output, system_output: system });
		setSystemInfo(false);
		console.log(compiled);
	};

	useEffect(() => {
		const langpick = {
			python3: python(),
			"javascript-node": javascript(),
			"c-clang": cpp(),
			"cpp-clang": cpp(),
			"java-jdk": java()
		};
		let isDark = type === "dark" ? true : false;
		const view = new EditorView({
			doc,
			extensions: [
				basicSetup,
				keymap.of([indentWithTab]),
				langpick[lang],
				EditorView.updateListener.of((v) => {
					if (v.docChanged) {
						updateAttributes({ code_content: v.state.doc.toString() });
					}
				}),
				EditorView.theme({}, { dark: isDark }),
				...themeExtensions[isDark ? "dark" : "light"]
			],
			parent: refEditor.current
		});
		return () => {
			view.destroy();
		};
	}, [type, lang]);

	return (
		<NodeViewWrapper>
			<Container
				display="inline-block"
				contentEditable={false}
				css={{
					background: type === "dark" ? oneDarkColors.background : "white",
					color: type === "dark" ? oneDarkColors.ivory : "#4D4D4C",
					borderRadius: "$lg",
					padding: "$md $lg",
					margin: "$10 0",
					border: type === "dark" ? "" : "1px solid $border",
					breakInside: "avoid"
				}}
			>
				<Row
					justify="space-between"
					align="center"
					css={{ marginBottom: "0.5rem" }}
				>
					<Dropdown>
						<Dropdown.Button
							light
							className="code-language-dropdown"
							ripple={false}
							icon={
								<svg
									className="no-print"
									fill="none"
									height="14"
									viewBox="0 0 24 24"
									width="14"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M17.9188 8.17969H11.6888H6.07877C5.11877 8.17969 4.63877 9.33969 5.31877 10.0197L10.4988 15.1997C11.3288 16.0297 12.6788 16.0297 13.5088 15.1997L15.4788 13.2297L18.6888 10.0197C19.3588 9.33969 18.8788 8.17969 17.9188 8.17969Z"
										fill="currentColor"
									></path>
								</svg>
							}
							css={{
								tt: "capitalize",
								padding: "0",
								lineHeight: "0",
								height: "min-content",
								zIndex: 0,
								borderRadius: 0,
								color: type === "dark" ? oneDarkColors.ivory : "#4D4D4C"
							}}
						>
							{langDict[lang]}
						</Dropdown.Button>
						<Dropdown.Menu
							items={TioLanguages}
							onAction={(key) => {
								updateAttributes({ language: TioLanguages[key] });
							}}
						>
							{TioLanguages.map((lang, index) => (
								<Dropdown.Item key={index} value={lang}>
									{langDict[lang]}
								</Dropdown.Item>
							))}
						</Dropdown.Menu>
					</Dropdown>
					<Button
						auto
						size="sm"
						className="no-print"
						onPress={() => run()}
						css={{ zIndex: 0 }}
					>
						Run
					</Button>
				</Row>
				<div ref={refEditor} />
				<Spacer y={0.5} />
				<Spacer y={0.5} />

				{result && (
					<>
						<hr></hr>
						<Spacer y={0.5} />
						<Row justify="space-between" css={{ whiteSpace: "pre-line" }}>
							<details
								className="code-block-output"
								style={{ background: "transparent" }}
								data-content={result}
							>
								<summary
									style={{
										display: "flex",
										alignItems: "center",
										gap: "0.3rem"
									}}
									onClick={() => setCodeOutputOpen(!codeOutputOpen)}
								>
									{console.log(window.matchMedia("print"))}
									{codeOutputOpen ? (
										<svg
											className="no-print"
											fill="none"
											height="14"
											viewBox="0 0 24 24"
											width="14"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M17.9188 8.17969H11.6888H6.07877C5.11877 8.17969 4.63877 9.33969 5.31877 10.0197L10.4988 15.1997C11.3288 16.0297 12.6788 16.0297 13.5088 15.1997L15.4788 13.2297L18.6888 10.0197C19.3588 9.33969 18.8788 8.17969 17.9188 8.17969Z"
												fill="currentColor"
											></path>
										</svg>
									) : (
										<svg
											className="no-print"
											fill="none"
											height="14"
											viewBox="0 0 24 24"
											width="14"
											xmlns="http://www.w3.org/2000/svg"
											transform="rotate(-90)"
										>
											<path
												d="M17.9188 8.17969H11.6888H6.07877C5.11877 8.17969 4.63877 9.33969 5.31877 10.0197L10.4988 15.1997C11.3288 16.0297 12.6788 16.0297 13.5088 15.1997L15.4788 13.2297L18.6888 10.0197C19.3588 9.33969 18.8788 8.17969 17.9188 8.17969Z"
												fill="currentColor"
											></path>
										</svg>
									)}
									Output
								</summary>
								{result}
							</details>
							{time.match(/(Real time: (.*) s)/g)}
						</Row>
					</>
				)}
			</Container>
		</NodeViewWrapper>
	);
};
