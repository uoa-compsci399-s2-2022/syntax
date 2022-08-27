import { Container, Input, Avatar, Button } from "@nextui-org/react";
import NotesList from "../components/NotesList";

const NoteSidebar = ({ notes }) => {
  return (
    <Container xs display="flex" wrap="nowrap" css={{ "max-width": "30%", "min-width": "fit-content", padding: "0", background: "$bg800" }}>
      <Container display="flex" justify="center" css={{ width: "20%", padding: "20px", background: "$bg700" }}>
        <Avatar color="primary" />
      </Container>
      <Container css={{ "padding": "20px" }}>
        <Input clearable placeholder="Search notes" type="search" css={{ width: "100%" }} />
        <NotesList retrieved_notes={notes} showEditor={undefined} />
        <Button css={{ width: "100%"}}>Add new note</Button>
      </Container>
    </Container>
  );
};

export default NoteSidebar;
