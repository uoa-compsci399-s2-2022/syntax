import MenuItem from "./MenuItem";
import { useState } from "react";
import {
  Container,
  Dropdown,
  Tooltip,
} from "@nextui-org/react";
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

export default ({ editor }) => {
  if (!editor) {
    return null;
  }

  const iconSize = "1.5em";
  const iconColor = "var(--nextui-colors-text)";
  const [selectedTextLevel, setSelectedTextLevel] = useState(
    new Set(["Normal text"])
  );

  const textLevelList = [
    { label: "Normal text", value: "0" },
    { label: "Heading 1", value: "1" },
    { label: "Heading 2", value: "2" },
    { label: "Heading 3", value: "3" },
    { label: "Heading 4", value: "4" },
    { label: "Heading 5", value: "5" },
    { label: "Heading 6", value: "6" },
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

  const items = [
    {
      type: "menu-divider",
    },
    {
      icon: <BiBold size={iconSize} color={iconColor} />,
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      icon: <BiItalic size={iconSize} color={iconColor} />,
      title: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      icon: <BiStrikethrough size={iconSize} color={iconColor} />,
      title: "Strike",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
    },
    {
      icon: <BiCode size={iconSize} color={iconColor} />,
      title: "Code",
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive("code"),
    },
    {
      type: "menu-divider",
    },
    {
      icon: <BiListUl size={iconSize} color={iconColor} />,
      title: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
    },
    {
      icon: <BiListOl size={iconSize} color={iconColor} />,
      title: "Ordered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
    },
    {
      icon: <BiCodeBlock size={iconSize} color={iconColor} />,
      title: "Code Block",
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive("codeBlock"),
    },
    {
      icon: <BiPoll size={iconSize} color={iconColor} />,
      title: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive("blockquote"),
    },
    {
      icon: <BiMinus size={iconSize} color={iconColor} />,
      title: "Divider",
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      type: "menu-divider",
    },
    {
      icon: <BiSubdirectoryLeft size={iconSize} color={iconColor} />,
      title: "Line break",
      action: () => editor.chain().focus().setHardBreak().run(),
    },
    {
      icon: <BiEditAlt size={iconSize} color={iconColor} />,
      title: "Clear formatting",
      action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
    },
    {
      type: "menu-divider",
    },
    {
      icon: <BiUndo size={iconSize} color={iconColor} />,
      title: "Undo",
      action: () => editor.chain().focus().undo().run(),
    },
    {
      icon: <BiRedo size={iconSize} color={iconColor} />,
      title: "Redo",
      action: () => editor.chain().focus().redo().run(),
    },
  ];

  return (
    <Container
      fluid
      display="flex"
      alignItems="center"
      css={{ padding: "0.2rem 0", margin: "0" }}
    >
      <Tooltip content={"Text style"}>
        <Dropdown>
          <Dropdown.Button light color>{selectedTextLevel}</Dropdown.Button>
          <Dropdown.Menu
            aria-label="Text style selection"
            disallowEmptySelection
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

      {items.map((item, index) => (
        <div key={index}>
          {item.type === "menu-divider" ? (
            <div className="menu-divider" />
          ) : (
            <MenuItem {...item} />
          )}
        </div>
      ))}
    </Container>
  );
};
