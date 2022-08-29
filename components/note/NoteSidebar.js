import NoteList from "./NoteList";
import { Container, Input, Button } from "@nextui-org/react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";

const NoteSidebar = ({ notes }) => {
  return (
    <Container
      display="flex"
      wrap="nowrap"
      css={{
        "max-width": "25%",
        padding: "0",
        background: "$accents2",
        height: "100vh",
        float: "left",
        "overflow-y": "auto",
      }}
    >
      <Container css={{ padding: "30px" }}>
        <Input
          clearable
          placeholder="Search notes"
          type="search"
          contentLeft={<MagnifyingGlassIcon style={{ height: "24px" }} />}
          css={{ width: "100%" }}
        />
        <NoteList retrieved_notes={notes} showEditor={undefined} />
        <Button
          bordered
          color="primary"
          icon={<PlusIcon style={{ height: "24px" }} />}
          css={{ width: "100%" }}
        >
          Add new note
        </Button>
      </Container>
    </Container>
  );
};

export default NoteSidebar;
