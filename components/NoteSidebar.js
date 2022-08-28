import { Container, Input, Button } from "@nextui-org/react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import NotesList from "../components/NotesList";

const NoteSidebar = ({ notes }) => {
  return (
    <Container
      display="flex"
      wrap="nowrap"
      css={{
        "max-width": "25%",
        "min-width": "fit-content",
        padding: "0",
        background: "$bg800",
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
        <NotesList retrieved_notes={notes} showEditor={undefined} />
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
