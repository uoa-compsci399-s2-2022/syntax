import NoteList from "./NoteList";
import { Container, Input, Button, Spacer, Navbar } from "@nextui-org/react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  ChevronDoubleLeftIcon,
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
          "min-width": "200px"
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
        <Navbar.Content css={{ flex: "1" }}>
          <Navbar.Item css={{ flex: "1" }}>
            <Input
              clearable
              aria-label="Notes search bar"
              placeholder="Search notes"
              type="search"
              animated={false}
              contentLeft={
                <MagnifyingGlassIcon style={{ height: "var(--icon-size)" }} />
              }
              css={{ flex: "1" }}
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
              icon={
                <ChevronDoubleLeftIcon style={{ height: "var(--icon-size)" }} />
              }
            />
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>

      <NoteList retrieved_notes={notes} showEditor={undefined} />
      <Button
        bordered
        color="primary"
        icon={<PlusIcon style={{ height: "var(--icon-size)" }} />}
        css={{ width: "100%" }}
      >
        Add new note
      </Button>
      <Spacer />
    </Container>
  );
};

export default NoteSidebar;
