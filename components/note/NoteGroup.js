import {
  Collapse,
  Text,
  Avatar,
  Container,
  Row,
  Col,
  Button
} from "@nextui-org/react";
import { useState } from "react";
import {
  PlusIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";
import { useNote } from "../../modules/AppContext";

const NoteGroup = ({ name, color = "white", notes, openNote }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentNote = useNote();

  const handleOpen = () => {
    setIsOpen((current) => !current);
  };

  return (
    <Container css={{ padding: "0", marginBottom: "0.5rem" }}>
      <Container
        display="flex"
        justify="space-between"
        wrap="nowrap"
        css={{
          padding: "0 0.5rem",
          width: "100%",
          border: "none",
          textAlign: "left",
          outline: "none",
          backgroundColor: "$accents3"
        }}
      >
        <Container
          display="flex"
          wrap="nowrap"
          alignItems="center"
          css={{ padding: "0" }}
        >
          <Button
            light
            animated={false}
            onPress={handleOpen}
            icon={
              isOpen ? (
                <ChevronDownIcon style={{ height: "var(--icon-size-xs)" }} />
              ) : (
                <ChevronRightIcon style={{ height: "var(--icon-size-xs)" }} />
              )
            }
            css={{
              cursor: "pointer",
              minWidth: "0",
              maxWidth: "min-content",
              marginRight: "1rem"
            }}
          ></Button>
          <Col>
            <svg height="10" width="10" style={{ marginRight: "0.5rem" }}>
              <circle cx="5" cy="5" r="5" fill={color} />
            </svg>
            {name}
          </Col>
        </Container>
        <Button
          light
          animated={false}
          icon={<PlusIcon style={{ height: "var(--icon-size-xs)" }} />}
          css={{ cursor: "pointer", minWidth: "0", maxWidth: "min-content" }}
        ></Button>
      </Container>
      <Container
        css={{
          padding: "0",
          overflow: "hidden",
          display: isOpen ? "block" : "none"
        }}
      >
        <ul
          style={{
            margin: 0,
            backgroundColor: "var(--nextui-colors-accents3)"
          }}
        >
          {notes.map((note) => (
            <li
              key={note.id}
              style={{
                margin: "0",
                padding: "0.5rem 0 0.5rem calc(1rem + 0.5rem + 14px)",
                backgroundColor:
                  note.id === currentNote.id
                    ? "var(--nextui-colors-accents4)"
                    : "transparent"
              }}
            >
              <a
                onClick={() => {
                  openNote(note);
                }}
              >
                <DocumentTextIcon style={{ height: "var(--icon-size-xs)", marginRight: "0.5rem" }} />
                {note.title}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </Container>
  );
};

export default NoteGroup;
