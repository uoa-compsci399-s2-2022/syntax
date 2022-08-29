import NoteDisplay from "../../components/note/NoteDisplay";
import NoteSidebar from "./NoteSidebar";
import { Container } from "@nextui-org/react";

const NoteLayout = ({ allNotes, currentNote }) => {
  return (
    <>
      <Container
        fluid
        display="flex"
        wrap="nowrap"
        css={{
          "min-width": "100%",
          "min-height": "100vh",
          padding: "0",
          margin: "0",
        }}
      >
        <NoteSidebar notes={allNotes} />
        <NoteDisplay note={currentNote} css={{ background: "$background" }} />
      </Container>
    </>
  );
};

export default NoteLayout;
