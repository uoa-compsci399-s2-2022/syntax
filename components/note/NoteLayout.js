import NoteDisplay from "../../components/note/NoteDisplay";
import NoteSidebar from "./NoteSidebar";
import { Container } from "@nextui-org/react";
import {
  useNote,
  useDispatchNote,
  useNotes,
  useDispatchNotes,
} from "../../modules/AppContext";

const NoteLayout = ({ allNotes, currentNote }) => {

  // const currentNote = useNote();

  return (
    <Container
      fluid
      display="flex"
      wrap="nowrap"
      css={{
        "min-width": "100vw",
        "min-height": "100vh",
        padding: "0",
        margin: "0",
      }}
    >
      <NoteSidebar notes={allNotes} />
      <NoteDisplay note={currentNote} css={{ background: "$background" }} key={currentNote}/>
    </Container>
  );
};

export default NoteLayout;
