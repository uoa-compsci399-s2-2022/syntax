import {
  Collapse,
  Text,
  Avatar,
  Container,
  Row,
  Col,
  Button,
  useTheme
} from "@nextui-org/react";
import { useState } from "react";
import {
  PlusIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";
import { useNote } from "../../modules/AppContext";

const NoteGroup = ({ name, color = "white", notes, openNote, createNote }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { checked, type } = useTheme();
  const currentNote = useNote();

  const handleOpen = () => {
    setIsOpen((current) => !current);
  };

  return (
    <Container css={{ padding: "0", marginBottom: "0.5rem" }}>
      <Container
        display="flex"
        justify="space-between"
        alignItems="center"
        wrap="nowrap"
        css={{
          padding: "0 0.5rem",
          width: "100%",
          border: "none",
          textAlign: "left",
          outline: "none",
          backgroundColor: "$accents4"
        }}
      >
        <Container
          display="flex"
          alignItems="center"
          wrap="nowrap"
          css={{ padding: "0.5rem 0" }}
        >
          <Button
            light
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
              maxWidth: "var(--icon-size-xs)",
              height: "var(--icon-size-xs)",
              padding: "0.8rem",
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
          onPress={() => createNote()}
          icon={<PlusIcon style={{ height: "var(--icon-size-xs)" }} />}
          css={{
            cursor: "pointer",
            minWidth: "0",
            maxWidth: "var(--icon-size-xs)",
            height: "var(--icon-size-xs)",
            padding: "0.8rem"
          }}
        ></Button>
      </Container>
      <Container
        css={{
          padding: "0",
          overflow: "hidden",
          transition: "max-height 0.3s ease",
          maxHeight: isOpen ? 320 * notes.length + "px" : "0"
        }}
      >
        <Container
          css={{
            padding: 0,
            backgroundColor: "var(--nextui-colors-accents4)"
          }}
        >
          {notes.map((note) => (
            <a
              onClick={() => {
                openNote(note);
              }}
            >
              <Row
                key={note.id}
                css={{
                  display: "block",
                  padding: "0.3rem calc(1rem + 0.5rem + 25px)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  backgroundColor:
                    note.id === currentNote.id ? "$accents5" : "transparent",
                  "&:hover": {
                    background: "$accents5"
                  }
                }}
              >
                {note.title}
              </Row>
            </a>
          ))}
        </Container>
      </Container>
    </Container>
  );
};

export default NoteGroup;
