import MenuItem from "@/components/editor/MenuItem";
import InputModal from "@/components/modal/InputModal";
import { useState, useEffect, useRef } from "react";
import { Container, Dropdown, Tooltip, Button } from "@nextui-org/react";
import { BiCodeBlock } from "react-icons/bi";
import {
	MdFormatBold,
	MdFormatItalic,
	MdCode,
	MdFormatUnderlined,
	MdStrikethroughS,
	MdSubscript,
	MdSuperscript,
	MdMoreHoriz,
	MdFormatClear,
	MdFormatListBulleted,
	MdFormatListNumbered,
	MdOutlineDraw,
	MdFormatQuote,
	MdHorizontalRule,
	MdFormatSize,
	MdVideocam,
	MdOutlineImage,
	MdInsertLink,
	MdAdd,
	MdOutlineUndo,
	MdOutlineRedo
} from "react-icons/md";

export default ({ editor }) => {
	if (!editor) {
		return null;
	}
	const iconSize = "1.5em";
	const iconColor = "var(--nextui-colors-text)";
	const [inputModal, setInputModal] = useState(false);
	const [inputType, setInputType] = useState();
	const [selectedTextStyle, setSelectedTextStyle] = useState(["Normal text"]);
	const [windowWidth, setWindowWidth] = useState(undefined);
	const textStyleList = [
		"Normal text",
		"Heading 1",
		"Heading 2",
		"Heading 3",
		"Heading 4",
		"Heading 5",
		"Heading 6"
	];

	const openHandler = (selectedInputType) => {
		if (selectedInputType === "link" && editor.isActive("link")) {
			editor.chain().focus().unsetLink().run();
		} else {
			setInputType(selectedInputType);
			setInputModal(true);
		}
	};

	const closeHandler = (url) => {
		if (url) {
			switch (inputType) {
				case "video":
					addYoutubeVideo(url);
					break;
				case "link":
					addLink(url);
					break;
			}
		}
		setInputModal(false);
	};

	useEffect(() => {
		if (typeof window !== "undefined") {
			function handleResize() {
				setWindowWidth(window.innerWidth);
			}
			window.addEventListener("resize", handleResize);
			handleResize();
			return () => window.removeEventListener("resize", handleResize);
		}
	}, []);

	editor.on("selectionUpdate", ({ editor }) => {
		if (Object.keys(editor.getAttributes("heading")).length === 0) {
			setSelectedTextStyle(textStyleList[0]);
		} else {
			setSelectedTextStyle(
				textStyleList[editor.getAttributes("heading").level]
			);
		}
	});

	const textStyleHandler = (key) => {
		setSelectedTextStyle(key);
		let textStyle = +key["currentKey"].charAt(key["currentKey"].length - 1);
		if (isNaN(textStyle)) {
			editor.chain().focus().setParagraph().run();
		} else {
			editor.chain().focus().toggleHeading({ level: textStyle }).run();
		}
	};

	const formattingHandler = (key) => {
		formattingOptions[key].action();
	};

	const listHandler = (key) => {
		listOptions[key].action();
	};

	const insertOptionHandler = (key) => {
		insertOptions[key].action();
	};

	const addYoutubeVideo = (url) => {
		editor.commands.setYoutubeVideo({
			src: url
		});
	};

	const addLink = (url) => {
		if (!(url.match(/https:\/\/*/) || url.match(/http:\/\/*/))) {
			url = "https://" + url;
		}
		editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
	};

	const coreOptions = [
		{
			icon: <MdFormatBold size={iconSize} color={iconColor} />,
			label: "Bold",
			action: () => editor.chain().focus().toggleBold().run(),
			isActive: () => editor.isActive("bold")
		},
		{
			icon: <MdFormatItalic size={iconSize} color={iconColor} />,
			label: "Italic",
			action: () => editor.chain().focus().toggleItalic().run(),
			isActive: () => editor.isActive("italic")
		},
		{
			icon: <MdCode size={iconSize} color={iconColor} />,
			label: "Code",
			action: () => editor.chain().focus().toggleCode().run(),
			isActive: () => editor.isActive("code"),
			breakpoint: "sm"
		}
	];

	const formattingOptions = {
		code: {
			icon: <MdCode size={iconSize} color={iconColor} />,
			label: "Code",
			action: () => editor.chain().focus().toggleCode().run(),
			isActive: () => editor.isActive("code"),
			breakpoint: "sm"
		},
		underline: {
			icon: <MdFormatUnderlined size={iconSize} color={iconColor} />,
			label: "Underline",
			action: () => editor.chain().focus().toggleUnderline().run(),
			isActive: () => editor.isActive("underline")
		},
		strike: {
			icon: <MdStrikethroughS size={iconSize} color={iconColor} />,
			label: "Strikethrough",
			action: () => editor.chain().focus().toggleStrike().run(),
			isActive: () => editor.isActive("strike")
		},
		subscript: {
			icon: <MdSubscript size={iconSize} color={iconColor} />,
			label: "Subscript",
			action: () => editor.chain().focus().toggleSubscript().run(),
			isActive: () => editor.isActive("subscript")
		},
		superscript: {
			icon: <MdSuperscript size={iconSize} color={iconColor} />,
			label: "Superscript",
			action: () => editor.chain().focus().toggleSuperscript().run(),
			isActive: () => editor.isActive("superscript")
		},
		clearFormatting: {
			icon: <MdFormatClear size={iconSize} color={iconColor} />,
			label: "Clear formatting",
			action: () => editor.chain().focus().clearNodes().unsetAllMarks().run()
		},
		undo: {
			icon: <MdOutlineUndo size={iconSize} color={iconColor} />,
			label: "Undo",
			action: () => editor.chain().focus().undo().run()
		},
		redo: {
			icon: <MdOutlineRedo size={iconSize} color={iconColor} />,
			label: "Redo",
			action: () => editor.chain().focus().redo().run()
		}
	};

	const listOptions = {
		bulletList: {
			icon: <MdFormatListBulleted size={iconSize} color={iconColor} />,
			label: "Bulleted List",
			action: () => editor.chain().focus().toggleBulletList().run(),
			isActive: () => editor.isActive("bulletList"),
			breakpoint: "sm"
		},
		orderedList: {
			icon: <MdFormatListNumbered size={iconSize} color={iconColor} />,
			label: "Ordered List",
			action: () => editor.chain().focus().toggleOrderedList().run(),
			isActive: () => editor.isActive("orderedList"),
			breakpoint: "sm"
		}
	};

	const insertOptions = {
		link: {
			icon: <MdInsertLink size={iconSize} color={iconColor} />,
			label: "Link",
			key: "link",
			action: () => openHandler("link"),
			isActive: () => editor.isActive("link"),
			breakpoint: "xs"
		},
		codeBlock: {
			icon: <BiCodeBlock size={iconSize} color={iconColor} />,
			label: "Code Block",
			key: "codeBlock",
			action: () => editor.chain().focus().insertCodeBlock().run(),
			isActive: () => editor.isActive("codeBlock"),
			breakpoint: "xs"
		},
		video: {
			icon: <MdVideocam size={iconSize} color={iconColor} />,
			label: "Video",
			key: "video",
			action: () => openHandler("video"),
			breakpoint: "sm"
		},
		blockquote: {
			icon: <MdFormatQuote size={iconSize} color={iconColor} />,
			label: "Blockquote",
			key: "blockquote",
			action: () => editor.chain().focus().toggleBlockquote().run(),
			isActive: () => editor.isActive("blockquote"),
			breakpoint: "sm"
		},
		horizontalRule: {
			icon: <MdHorizontalRule size={iconSize} color={iconColor} />,
			label: "Divider",
			key: "horizontalRule",
			action: () => editor.chain().focus().setHorizontalRule().run(),
			breakpoint: "sm"
		}
	};

	return (
		<Container
			fluid
			display="flex"
			justify="center"
			css={{
				zIndex: 1,
				alignItems: "center",
				minWidth: "100%",
				position: "fixed",
				left: "0",
				bottom: "0",
				background: "$background",
				padding: "0.3rem 1rem",
				margin: "0",
				"@xs": {
					justifyContent: "flex-start",
					borderBottom: "1px solid $border",
					borderRadius: "$lg $lg 0 0",
					position: "sticky",
					top: "0",
					right: "0"
				}
			}}
		>
			{/* Text style (normal text, headings) dropdown */}
			<Tooltip content={"Text style"}>
				<Dropdown>
					<Dropdown.Button
						light
						ripple={false}
						css={{
							transition: "none",
							padding: "0",
							"@sm": { padding: "10px" }
						}}
					>
						{windowWidth > 960 ? (
							selectedTextStyle
						) : (
							<MdFormatSize size={iconSize} />
						)}
					</Dropdown.Button>
					<Dropdown.Menu
						disallowEmptySelection
						aria-label="Text style selection"
						selectionMode="single"
						selectedKeys={selectedTextStyle}
						onSelectionChange={textStyleHandler}
					>
						{textStyleList.map((textStyle) => (
							<Dropdown.Item key={textStyle}>{textStyle}</Dropdown.Item>
						))}
					</Dropdown.Menu>
				</Dropdown>
			</Tooltip>

			<div className="menu-divider" />

			{/* Core formatting options (bold, italic, inline code) */}
			{coreOptions.map((item, index) => (
				<MenuItem {...item} key={index} />
			))}

			{/* Extended formatting options + clear formatting */}
			<Tooltip content={"More formatting"}>
				<Dropdown>
					<Dropdown.Button
						light
						ripple={false}
						className={`menu-item${
							(editor.isActive("code") && windowWidth < 960) ||
							editor.isActive("underline") ||
							editor.isActive("strike") ||
							editor.isActive("subscript") ||
							editor.isActive("superscript")
								? " is-active"
								: ""
						}`}
						icon={<MdMoreHoriz size={iconSize} color={iconColor} />}
					/>
					<Dropdown.Menu
						aria-label="More Formatting"
						onAction={formattingHandler}
					>
						<Dropdown.Section aria-label="Extended Formatting Options">
							{Object.entries(formattingOptions)
								.slice(0, -3)
								.map(([key, item]) => (
									<Dropdown.Item
										icon={item.icon}
										key={key}
										css={{
											background: editor.isActive(key) ? "$neutralLight" : "",
											"@sm": { display: item.breakpoint === "sm" ? "none" : "" }
										}}
									>
										{item.label}
									</Dropdown.Item>
								))}
						</Dropdown.Section>
						<Dropdown.Section aria-label="Clear Formatting">
							{Object.entries(formattingOptions)
								.slice(-3)
								.map(([key, item]) => (
									<Dropdown.Item icon={item.icon} key={key}>
										{item.label}
									</Dropdown.Item>
								))}
						</Dropdown.Section>
					</Dropdown.Menu>
				</Dropdown>
			</Tooltip>

			<div className="menu-divider" />

			{/* List-related options */}
			{Object.entries(listOptions).map(([key, item], index) => (
				<MenuItem {...item} key={index} />
			))}

			<Tooltip content={"Lists"}>
				<Dropdown>
					<Dropdown.Button
						light
						ripple={false}
						className={`menu-item${
							editor.isActive("bulletList") || editor.isActive("orderedList")
								? " is-active"
								: ""
						}`}
						css={{
							padding: "5px",
							"@xs": { padding: "10px" },
							"@sm": { display: "none" }
						}}
					>
						<MdFormatListBulleted size={iconSize} />
					</Dropdown.Button>
					<Dropdown.Menu aria-label="List selection" onAction={listHandler}>
						{Object.entries(listOptions).map(([key, item]) => (
							<Dropdown.Item
								icon={item.icon}
								key={key}
								css={{
									background: editor.isActive(key) ? "$neutralLight" : ""
								}}
							>
								{item.label}
							</Dropdown.Item>
						))}
					</Dropdown.Menu>
				</Dropdown>
			</Tooltip>

			<div className="menu-divider" />

			{/* Extended node options (code block, video, etc.) - home page does not have image/drawing */}
			{Object.entries(insertOptions).map(([key, item], index) => (
				<MenuItem {...item} key={index} />
			))}

			<Tooltip content={"Insert"}>
				<Dropdown>
					<Dropdown.Button
						light
						ripple={false}
						css={{
							transition: "none",
							padding: "0",
							display: "flex",
							"@xs": { padding: "10px" },
							"@sm": { display: "none" }
						}}
					>
						<MdAdd size={iconSize} color={iconColor} />
					</Dropdown.Button>
					<Dropdown.Menu
						aria-label="Insert Options"
						onAction={insertOptionHandler}
					>
						{Object.entries(insertOptions).map(([key, item]) => (
							<Dropdown.Item
								icon={item.icon}
								key={key}
								css={{
									background: editor.isActive(key) ? "$neutralLight" : "",
									"@xs": { display: item.breakpoint === "xs" ? "none" : "" },
									"@sm": { display: item.breakpoint === "sm" ? "none" : "" }
								}}
							>
								{item.label}
							</Dropdown.Item>
						))}
					</Dropdown.Menu>
				</Dropdown>
			</Tooltip>
			<InputModal
				open={inputModal}
				closeHandler={closeHandler}
				inputType={inputType}
			/>
		</Container>
	);
};
