import MenuItem from "./MenuItem";
import { useState } from "react";
import { Container, Dropdown, Tooltip } from "@nextui-org/react";
import {
  BiUndo,
  BiRedo,
  BiBold,
  BiItalic,
  BiUnderline,
  BiStrikethrough,
  BiCode,
  BiListUl,
  BiListOl,
  BiCodeBlock,
  BiPoll,
  BiMinus,
  BiEditAlt,
  BiDotsHorizontalRounded,
  BiPalette,
  BiLink,
  BiImage,
  BiFilm
} from "react-icons/bi";
import { PlusIcon } from "@heroicons/react/24/outline";
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
  MdHorizontalRule
} from "react-icons/md";

export default ({ editor }) => {
  if (!editor) {
    return null;
  }

  const iconSize = "1.5em";
  const iconColor = "var(--nextui-colors-text)";
  const [selectedTextLevel, setSelectedTextLevel] = useState(["Normal text"]);

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
      editor.isActive("paragraph");
    } else {
      editor.chain().focus().toggleHeading({ level: textLevel }).run();
      editor.isActive("heading", { level: textLevel });
    }
  };

  const moreFormattingHandler = (key) => {
    switch (key) {
      case "underline":
        editor.chain().focus().toggleUnderline().run();
        editor.isActive("underline");
        break;
      case "strikethrough":
        editor.chain().focus().toggleStrike().run();
        editor.isActive("strike");
        break;
      case "subscript":
        editor.chain().focus().toggleSubscript().run();
        editor.isActive("subscript");
        break;
      case "superscript":
        editor.chain().focus().toggleSuperscript().run();
        editor.isActive("superscript");
        break;
      case "clear-formatting":
        editor.chain().focus().clearNodes().unsetAllMarks().run();
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
      if (!(url.match(/https:\/\/*/) || url.match(/http:\/\/*/))) {
        url = 'https://' + url
      }
      if (url) {
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

  {
    /* Markdown buttons which should be displayed at all resolutions */
  }
  const coreItems = [
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
      isActive: () => editor.isActive("code")
    }
  ];

  {
    /* Markdown buttons which should be condensed into a dropdown at smaller resolutions */
  }
  const extendedItems = [
    {
      icon: <BiLink size={iconSize} color={iconColor} />,
      title: "Link",
      action: addLink,
      isActive: () => editor.isActive("link")
    },
    {
      icon: <BiCodeBlock size={iconSize} color={iconColor} />,
      title: "Code Block",
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive("codeBlock")
    },
    {
      icon: <MdOutlineDraw size={iconSize} color={iconColor} />,
      title: "Drawing",
      action: () => console.log("TBA")
    },
    {
      icon: <BiImage size={iconSize} color={iconColor} />,
      title: "Image",
      action: () => console.log("TBA")
    },
    {
      icon: <BiFilm size={iconSize} color={iconColor} />,
      title: "Video",
      action: addYoutubeVideo
    },
    {
      icon: <MdFormatQuote size={iconSize} color={iconColor} />,
      title: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive("blockquote")
    },
    {
      icon: <MdHorizontalRule size={iconSize} color={iconColor} />,
      title: "Divider",
      action: () => editor.chain().focus().setHorizontalRule().run()
    }
  ];

  return (
    <Container
      fluid
      display="flex"
      justify="center"
      css={{
        "z-index": 1,
        "align-items": "center",
        position: "fixed",
        left: "0",
        bottom: "0",
        background: "$background",
        padding: "0.3rem 0",
        margin: "0",
        "@xs": {
          "justify-content": "flex-start",
          "border-bottom": "1px solid $border",
          position: "relative"
        }
      }}
    >
      {/* Text style (normal text, headings) dropdown */}
      <Tooltip content={"Text style"}>
        <Dropdown>
          <Dropdown.Button light css={{ padding: "10px", transition: "none" }}>
            {selectedTextLevel}
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
      {coreItems.map((item, index) => (
        <MenuItem {...item} isCore={true} />
      ))}

      {/* Extended formatting options + clear formatting */}
      <Tooltip content={"More formatting"}>
        <Dropdown>
          <Dropdown.Button light icon={<MdMoreHoriz />} />
          <Dropdown.Menu
            disallowEmptySelection
            aria-label="Text style selection"
            selectionMode="single"
            selectedKeys={selectedTextLevel}
            onAction={moreFormattingHandler}
          >
            <Dropdown.Section aria-label="Extended Formatting Options">
              <Dropdown.Item
                icon={<MdFormatUnderlined />}
                key="underline"
                css={{
                  background: editor.isActive("underline")
                    ? "$neutralLight"
                    : ""
                }}
              >
                Underline
              </Dropdown.Item>
              <Dropdown.Item
                icon={<MdStrikethroughS />}
                key="strikethrough"
                css={{
                  background: editor.isActive("strike") ? "$neutralLight" : ""
                }}
              >
                Strikethrough
              </Dropdown.Item>
              <Dropdown.Item
                icon={<MdSubscript />}
                key="subscript"
                css={{
                  background: editor.isActive("subscript")
                    ? "$neutralLight"
                    : ""
                }}
              >
                Subscript
              </Dropdown.Item>
              <Dropdown.Item
                icon={<MdSuperscript />}
                key="superscript"
                css={{
                  background: editor.isActive("superscript")
                    ? "$neutralLight"
                    : ""
                }}
              >
                Superscript
              </Dropdown.Item>
            </Dropdown.Section>
            <Dropdown.Section aria-label="Clear Formatting">
              <Dropdown.Item icon={<MdFormatClear />} key="clear-formatting">
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
        action={() => editor.chain().focus().toggleBulletList().run()}
        isActive={() => editor.isActive("bulletList")}
      />
      <MenuItem
        title="Ordered List"
        icon={<MdFormatListNumbered size={iconSize} color={iconColor} />}
        action={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={() => editor.isActive("orderedList")}
      />

      <div className="menu-divider" />

      {/* Extended node options (image, drawing, code block, video, etc.) */}
      {extendedItems.map((item, index) => (
        <span key={index}>
          {item.type === "menu-divider" ? (
            <div
              className="menu-divider"
              style={{ display: "none", "@md": { display: "flex" } }}
            />
          ) : (
            <MenuItem {...item} />
          )}
        </span>
      ))}

      <Tooltip content={"More options"}>
        <Dropdown>
          <Dropdown.Button
            light
            icon={<PlusIcon style={{ height: "1.5em" }} />}
            css={{
              transition: "none",
              padding: "10px",
              display: "flex",
              "@md": { display: "none" }
            }}
          />
          <Dropdown.Menu aria-label="More markdown options">
            {extendedItems
              .filter((item) => !("type" in item))
              .map((item) => (
                <Dropdown.Item key={item.title} icon={item.icon}>
                  {item.title}
                </Dropdown.Item>
              ))}
          </Dropdown.Menu>
        </Dropdown>
      </Tooltip>

      <div className="menu-divider" />

      {/* Undo/redo buttons */}
      <MenuItem
        title="Undo"
        icon={<BiUndo size={iconSize} color={iconColor} />}
        action={() => editor.chain().focus().undo().run()}
      />
      <MenuItem
        title="Redo"
        icon={<BiRedo size={iconSize} color={iconColor} />}
        action={() => editor.chain().focus().redo().run()}
      />
    </Container>
  );
};
