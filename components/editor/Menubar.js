import MenuItem from "./MenuItem";
import { useState } from "react";
import { Container, Dropdown, Tooltip } from "@nextui-org/react";
import {
  BiUndo,
  BiRedo,
  BiBold,
  BiItalic,
  BiStrikethrough,
  BiCode,
  BiListUl,
  BiListOl,
  BiCodeBlock,
  BiPoll,
  BiMinus,
  BiSubdirectoryLeft,
  BiEditAlt
} from "react-icons/bi";
import { PlusIcon } from "@heroicons/react/24/outline";

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

  const selectionChangeHandler = (key) => {
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

  editor.on("selectionUpdate", ({ editor }) => {
    if (Object.keys(editor.getAttributes("heading")).length === 0) {
      setSelectedTextLevel(textLevelList[0].label);
    } else {
      setSelectedTextLevel(
        textLevelList[editor.getAttributes("heading").level].label
      );
    }
  });

  const coreItems = [
    {
      type: "menu-divider"
    },
    {
      icon: <BiBold size={iconSize} color={iconColor} />,
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold")
    },
    {
      icon: <BiItalic size={iconSize} color={iconColor} />,
      title: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic")
    },
    {
      icon: <BiStrikethrough size={iconSize} color={iconColor} />,
      title: "Strike",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike")
    },
    {
      icon: <BiCode size={iconSize} color={iconColor} />,
      title: "Code",
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive("code")
    },
    {
      type: "menu-divider"
    }
  ];

  const extendedItems = [
    {
      icon: <BiListUl size={iconSize} color={iconColor} />,
      title: "Bulleted List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList")
    },
    {
      icon: <BiListOl size={iconSize} color={iconColor} />,
      title: "Ordered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList")
    },
    {
      icon: <BiCodeBlock size={iconSize} color={iconColor} />,
      title: "Code Block",
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive("codeBlock")
    },
    {
      icon: <BiPoll size={iconSize} color={iconColor} />,
      title: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive("blockquote")
    },
    {
      icon: <BiMinus size={iconSize} color={iconColor} />,
      title: "Divider",
      action: () => editor.chain().focus().setHorizontalRule().run()
    },
    {
      type: "menu-divider"
    },
    {
      icon: <BiSubdirectoryLeft size={iconSize} color={iconColor} />,
      title: "Line break",
      action: () => editor.chain().focus().setHardBreak().run()
    },
    {
      icon: <BiEditAlt size={iconSize} color={iconColor} />,
      title: "Clear formatting",
      action: () => editor.chain().focus().clearNodes().unsetAllMarks().run()
    },
    {
      type: "menu-divider"
    },
    {
      icon: <BiUndo size={iconSize} color={iconColor} />,
      title: "Undo",
      action: () => editor.chain().focus().undo().run()
    },
    {
      icon: <BiRedo size={iconSize} color={iconColor} />,
      title: "Redo",
      action: () => editor.chain().focus().redo().run()
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
            onSelectionChange={selectionChangeHandler}
          >
            {textLevelList.map((textLevel) => (
              <Dropdown.Item key={textLevel.label}>
                {textLevel.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Tooltip>

      {coreItems.map((item, index) => (
        <div key={index}>
          {item.type === "menu-divider" ? (
            <div className="menu-divider" />
          ) : (
            <MenuItem {...item} isCore={true} />
          )}
        </div>
      ))}

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
    </Container>
  );
};
