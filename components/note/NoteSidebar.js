import NoteList from "./NoteList";
import { Container, Input, Button, Spacer, Navbar } from "@nextui-org/react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";

const NoteSidebar = ({ notes, sidebarDisplay, handleSidebarDisplay }) => {
  return (
    <Container
      wrap="nowrap"
      direction="column"
      css={{
        position: "absolute",
        "z-index": "999",
        width: "100vw",
        transition: "transform 0.2s ease-in-out",
        transform: sidebarDisplay ? "translateX(-101%)" : "translateX(0%)",
        padding: "0 30px",
        margin: "0",
        background: "$accents2",
        height: "100vh",
        float: "left",
        "overflow-y": "auto",
        "@xs": {
          position: sidebarDisplay ? "fixed" : "relative",
          "max-width": "20%",
          "min-width": "min-content",
        },
      }}
    >
      <Navbar
        variant="sticky"
        disableShadow
        disableBlur
        containerCss={{
          background: "$accents2",
          padding: "0",
        }}
      >
        <Navbar.Content>
          <Navbar.Item>
            <Input
              clearable
              aria-label="Notes search bar"
              placeholder="Search notes"
              type="search"
              contentLeft={<MagnifyingGlassIcon style={{ height: "24px" }} />}
              css={{ width: "100%" }}
            />
          </Navbar.Item>
        </Navbar.Content>
        <Navbar.Content>
          <Navbar.Item>
            <Button
              auto
              light
              animated={false}
              onPress={handleSidebarDisplay}
              icon={<ChevronDoubleLeftIcon style={{ height: "24px" }} />}
            />
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>

      <NoteList retrieved_notes={notes} showEditor={undefined} />
      <Button
        bordered
        color="primary"
        icon={<PlusIcon style={{ height: "24px" }} />}
        css={{ width: "100%" }}
      >
        Add new note
      </Button>
      <Spacer />
    </Container>
  );
};

export default NoteSidebar;
