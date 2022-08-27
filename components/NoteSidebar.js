import { Container, Input, Avatar } from "@nextui-org/react";
import NotesList from "../components/NotesList";

const NoteSidebar = ({ notes }) => {
  return (
    <Container xs display="flex" wrap="nowrap" css={{ background: "$bg800", padding: "0" }}>
      <Container display="flex" justify="center" css={{ "max-width": "20%", background: "$bg700" }}>
        <Avatar color="primary" />
      </Container>
      <Container>
        <Input clearable placeholder="Search notes" type="search" />
        <NotesList retrieved_notes={notes} showEditor={undefined} />
      </Container>
    </Container>
  );
};

export default NoteSidebar;
