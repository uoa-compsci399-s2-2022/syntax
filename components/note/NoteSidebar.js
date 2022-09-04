import NoteList from "./NoteList";
import SettingsModal from "@/components/modal/SettingsModal";
import { useState } from "react";
import {
  Container,
  Input,
  Button,
  Avatar,
  Navbar,
  Spacer
} from "@nextui-org/react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  ChevronDoubleLeftIcon
} from "@heroicons/react/24/outline";

const NoteSidebar = ({ notes, sidebarDisplay, handleSidebarDisplay }) => {
  const [settingsModal, setSettingsModal] = useState(false);

  const closeHandler = () => {
    setSettingsModal(false);
  };

  return (
    <Container
      display="flex"
      wrap="nowrap"
      direction="column"
      css={{
        position: "absolute",
        "z-index": "999",
        width: "100vw",
        transition: "transform 0.2s ease-in-out",
        transform: sidebarDisplay ? "translateX(-101%)" : "translateX(0%)",
        padding: "0",
        margin: "0",
        background: "$accents2",
        height: "100vh",
        float: "left",
        "@xs": {
          position: sidebarDisplay ? "fixed" : "relative",
          "max-width": "15%",
          "min-width": "200px"
        }
      }}
    >
      <Navbar
        disableShadow
        disableBlur
        containerCss={{
          background: "$accents2",
          padding: "0 10px",
          gap: "10px"
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
              onPress={setSettingsModal}
              icon={
                <Avatar
                  src="https://cdn3.emoji.gg/emojis/3568-catkiss.gif"
                  css={{ cursor: "pointer" }}
                />
              }
            />
          </Navbar.Item>
          <SettingsModal open={settingsModal} closeHandler={closeHandler} />
        </Navbar.Content>
      </Navbar>

      <Container
        css={{
          "overflow-y": "scroll",
          "overflow-x": "hidden",
          padding: "0",
          height: "100%"
        }}
      >
        <NoteList
          retrieved_notes={notes}
          groupName={"Test Group 1"}
          groupColor={"pink"}
        />
      </Container>

      <Container css={{ padding: "20px 10px" }}>
        <Button
          bordered
          auto
          color="primary"
          icon={<PlusIcon style={{ height: "var(--icon-size)" }} />}
          css={{ width: "100%" }}
        >
          Add new note
        </Button>
      </Container>
    </Container>
  );
};

export default NoteSidebar;
