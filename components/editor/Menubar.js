import MenuItem from "./MenuItem";
import { useState, useEffect } from "react";
import { Container, Dropdown, Tooltip } from "@nextui-org/react";
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
  MdAdd
} from "react-icons/md";

export default ({ editor }) => {
  if (!editor) {
    return null;
  }

  const iconSize = "1.5em";
  const iconColor = "var(--nextui-colors-text)";
  const [selectedTextLevel, setSelectedTextLevel] = useState(["Normal text"]);
  const [windowWidth, setWindowWidth] = useState(undefined);

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

  const textLevelList = [
    { label: "Normal text", value: "0" },
    { label: "Heading 1", value: "1" },
    { label: "Heading 2", value: "2" },
    { label: "Heading 3", value: "3" },
    { label: "Heading 4", value: "4" },
    { label: "Heading 5", value: "5" },
    { label: "Heading 6", value: "6" }
  ];

  const textStyleHandler = (key) => {
    setSelectedTextLevel(key);
    let textLevel = +key["currentKey"].charAt(key["currentKey"].length - 1);
    if (isNaN(textLevel)) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level: textLevel }).run();
    }
  };

  const formattingHandler = (key) => {
    switch (key) {
      case "code":
        editor.chain().focus().toggleCode().run();
        break;
      case "underline":
        editor.chain().focus().toggleUnderline().run();
        break;
      case "strike":
        editor.chain().focus().toggleStrike().run();
        break;
      case "subscript":
        editor.chain().focus().toggleSubscript().run();
        break;
      case "superscript":
        editor.chain().focus().toggleSuperscript().run();
        break;
      case "clear-formatting":
        editor.chain().focus().clearNodes().unsetAllMarks().run();
        break;
    }
  };

  const listHandler = (key) => {
    switch (key) {
      case "bulletList":
        editor.chain().focus().toggleBulletList().run();
        break;
      case "orderedList":
        editor.chain().focus().toggleOrderedList().run();
        break;
    }
  };

  const insertOptionHandler = (key) => {
    switch (key) {
      case "link":
        addLink();
        break;
      case "codeBlock":
        editor.chain().focus().toggleCodeBlock().run();
        break;
      case "drawing":
        break;
      case "image":
        break;
      case "video":
        addYoutubeVideo();
        break;
      case "blockquote":
        editor.chain().focus().toggleBlockquote().run();
        break;
      case "horizontalRule":
        editor.chain().focus().setHorizontalRule().run();
        break;
    }
  };

  const addYoutubeVideo = () => {
    const url = prompt("Enter YouTube URL");
    if (url) {
      editor.commands.setYoutubeVideo({
        src: url
      });
    }
  };

  const addLink = () => {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
    } else {
      const url = prompt("Enter URL");
      if (url) {
        if (!(url.match(/https:\/\/*/) || url.match(/http:\/\/*/))) {
          url = "https://" + url;
        }
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: url })
          .run();
      }
    }
  };

  editor.on("selectionUpdate", ({ editor }) => {
    if (Object.keys(editor.getAttributes("heading")).length === 0) {
      setSelectedTextLevel(textLevelList[0].label);
    } else {
      setSelectedTextLevel(
        textLevelList[editor.getAttributes("heading").level].label
      );
    }
  });

  const coreOptions = [
    {
      icon: <MdFormatBold size={iconSize} color={iconColor} />,
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold")
    },
    {
      icon: <MdFormatItalic size={iconSize} color={iconColor} />,
      title: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic")
    },
    {
      icon: <MdCode size={iconSize} color={iconColor} />,
      title: "Code",
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive("code"),
      css: { display: "none", "@sm": { display: "flex" } }
    }
  ];

  const formattingOptions = [
    {
      icon: <MdCode size={iconSize} color={iconColor} />,
      title: "Code",
      mark: "code",
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive("code"),
      breakpoint: "sm"
    },
    {
      icon: <MdFormatUnderlined size={iconSize} color={iconColor} />,
      title: "Underline",
      mark: "underline",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive("underline")
    },
    {
      icon: <MdStrikethroughS size={iconSize} color={iconColor} />,
      title: "Strikethrough",
      mark: "strike",
      action: () => editor.chain().focus().toggleSubscript().run(),
      isActive: () => editor.isActive("strike")
    },
    {
      icon: <MdSubscript size={iconSize} color={iconColor} />,
      title: "Subscript",
      mark: "subscript",
      action: () => editor.chain().focus().toggleSuperscript().run(),
      isActive: () => editor.isActive("subscript")
    },
    {
      icon: <MdSuperscript size={iconSize} color={iconColor} />,
      title: "Superscript",
      mark: "superscript",
      action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
      isActive: () => editor.isActive("superscript")
    }
  ];

  const insertOptions = [
    {
      icon: <MdInsertLink size={iconSize} color={iconColor} />,
      title: "Link",
      key: "link",
      action: () => insertOptionHandler("link"),
      isActive: () => editor.isActive("link"),
      breakpoint: "sm"
    },
    {
      icon: <BiCodeBlock size={iconSize} color={iconColor} />,
      title: "Code Block",
      key: "codeBlock",
      action: () => insertOptionHandler("codeBlock"),
      isActive: () => editor.isActive("codeBlock"),
      breakpoint: "sm"
    },
    {
      icon: <MdOutlineDraw size={iconSize} color={iconColor} />,
      title: "Drawing",
      key: "drawing",
      action: () => insertOptionHandler("drawing"),
      breakpoint: "sm"
    },
    {
      icon: <MdOutlineImage size={iconSize} color={iconColor} />,
      title: "Image",
      key: "image",
      action: () => insertOptionHandler("image"),
      breakpoint: "md"
    },
    {
      icon: <MdVideocam size={iconSize} color={iconColor} />,
      title: "Video",
      key: "video",
      action: () => insertOptionHandler("video"),
      breakpoint: "md"
    },
    {
      icon: <MdFormatQuote size={iconSize} color={iconColor} />,
      title: "Blockquote",
      key: "blockquote",
      action: () => insertOptionHandler("blockquote"),
      isActive: () => editor.isActive("blockquote"),
      breakpoint: "md"
    },
    {
      icon: <MdHorizontalRule size={iconSize} color={iconColor} />,
      title: "Divider",
      key: "horizontalRule",
      action: () => insertOptionHandler("horizontalRule"),
      breakpoint: "md"
    }
  ];

  return (
    <Container
      fluid
      display="flex"
      justify="center"
      css={{
        zIndex: 1,
        alignItems: "center",
        position: "fixed",
        left: "0",
        bottom: "0",
        background: "$background",
        padding: "0.3rem 0",
        margin: "0",
        "@xs": {
          justifyContent: "flex-start",
          borderBottom: "1px solid $border",
          borderTop: "1px solid $border",
          position: "sticky",
          top: "0",
          right: "0"
        }
      }}
    >
      {/* Text style (normal text, headings) dropdown */}
      <Tooltip content={"Text style"}>
        <Dropdown>
          <Dropdown.Button light css={{ padding: "10px", transition: "none" }}>
            {windowWidth > 960 ? (
              selectedTextLevel
            ) : (
              <MdFormatSize size={iconSize} />
            )}
          </Dropdown.Button>
          <Dropdown.Menu
            disallowEmptySelection
            aria-label="Text style selection"
            selectionMode="single"
            selectedKeys={selectedTextLevel}
            onSelectionChange={textStyleHandler}
          >
            {textLevelList.map((textLevel) => (
              <Dropdown.Item key={textLevel.label}>
                {textLevel.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Tooltip>

      <div className="menu-divider" />

      {/* Core formatting options (bold, italic, inline code) */}
      {coreOptions.map((item, index) => (
        <MenuItem {...item} />
      ))}

      {/* Extended formatting options + clear formatting */}
      <Tooltip content={"More formatting"}>
        <Dropdown>
          <Dropdown.Button
            light
            animated="false"
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
              {formattingOptions.map((item) => (
                <Dropdown.Item
                  icon={item.icon}
                  key={item.mark}
                  css={{
                    background: editor.isActive(item.mark)
                      ? "$neutralLight"
                      : "",
                    "@sm": { display: item.breakpoint === "sm" ? "none" : "" }
                  }}
                >
                  {item.title}
                </Dropdown.Item>
              ))}
            </Dropdown.Section>
            <Dropdown.Section aria-label="Clear Formatting">
              <Dropdown.Item
                icon={<MdFormatClear size={iconSize} color={iconColor} />}
                key="clear-formatting"
              >
                Clear formatting
              </Dropdown.Item>
            </Dropdown.Section>
          </Dropdown.Menu>
        </Dropdown>
      </Tooltip>

      <div className="menu-divider" />

      {/* List-related options*/}
      <MenuItem
        title="Bulleted List"
        icon={<MdFormatListBulleted size={iconSize} color={iconColor} />}
        action={() => listHandler("bulletList")}
        isActive={() => editor.isActive("bulletList")}
        css={{ display: "none", "@md": { display: "flex" } }}
      />
      <MenuItem
        title="Ordered List"
        icon={<MdFormatListNumbered size={iconSize} color={iconColor} />}
        action={() => listHandler("orderedList")}
        isActive={() => editor.isActive("orderedList")}
        css={{ display: "none", "@md": { display: "flex" } }}
      />

      <Tooltip content={"Lists"}>
        <Dropdown>
          <Dropdown.Button
            light
            animated="false"
            className={`menu-item${
              editor.isActive("bulletList") || editor.isActive("orderedList")
                ? " is-active"
                : ""
            }`}
            css={{ padding: "10px", "@md": { display: "none" } }}
          >
            <MdFormatListBulleted size={iconSize} />
          </Dropdown.Button>
          <Dropdown.Menu aria-label="List selection" onAction={listHandler}>
            <Dropdown.Item
              icon={<MdFormatListBulleted />}
              key="bulletList"
              css={{
                background: editor.isActive("bulletList") ? "$neutralLight" : ""
              }}
            >
              Bulleted List
            </Dropdown.Item>
            <Dropdown.Item
              icon={<MdFormatListNumbered />}
              key="orderedList"
              css={{
                background: editor.isActive("orderedList")
                  ? "$neutralLight"
                  : ""
              }}
            >
              Ordered List
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Tooltip>

      <div className="menu-divider" />

      {/* Extended node options (image, drawing, code block, video, etc.) */}
      {insertOptions.map((item) => (
        <MenuItem {...item} />
      ))}

      <Tooltip content={"Insert"}>
        <Dropdown>
          <Dropdown.Button
            light
            css={{
              transition: "none",
              padding: "10px",
              display: "flex",
              "@md": { display: "none" }
            }}
          >
            <MdAdd size={iconSize} color={iconColor} />
          </Dropdown.Button>
          <Dropdown.Menu
            aria-label="Insert Options"
            onAction={insertOptionHandler}
          >
            {insertOptions.map((item) => (
              <Dropdown.Item
                icon={item.icon}
                key={item.key}
                css={{
                  background: editor.isActive(item.key) ? "$neutralLight" : "",
                  "@sm": { display: item.breakpoint === "sm" ? "none" : "" },
                  "@md": { display: item.breakpoint === "md" ? "none" : "" }
                }}
              >
                {item.title}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Tooltip>

      {/*<div className="menu-divider" />

       Undo/redo buttons 
      <MenuItem
        title="Undo"
        icon={<BiUndo size={iconSize} color={iconColor} />}
        action={() => editor.chain().focus().undo().run()}
      />
      <MenuItem
        title="Redo"
        icon={<BiRedo size={iconSize} color={iconColor} />}
        action={() => editor.chain().focus().redo().run()}
      />*/}
    </Container>
  );
};
