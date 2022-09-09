import NoteList from "./NoteList";
import { useState, useEffect } from "react";
import {
  Container,
  Input,
  Button,
  Avatar,
  Navbar,
  Spacer,
  useTheme
} from "@nextui-org/react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  ChevronDoubleRightIcon
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import {
  useNote,
  useDispatchNote,
  useNotes,
  useDispatchNotes
} from "../../modules/AppContext";

const NoteSidebar = ({ notes, sidebarDisplay, handleSidebarDisplay }) => {
  const { checked, type } = useTheme();
  const router = useRouter();
  const currentNote = useNote();
  const setCurrentNote = useDispatchNote();
  const noteslist = useNotes();
  const setNotes = useDispatchNotes();

  const createNote = async () => {
    let res = await fetch("/api/note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "untitled", body: [] })
    });

    const newNote = await res.json();
    console.log("Create successful", { newNote });
    setCurrentNote(newNote);
    setNotes({ note: newNote, type: "add" });
    router.push(`/note/${newNote.id}`, undefined, { shallow: true });
  };

  return (
    <Container
      display="flex"
      wrap="nowrap"
      direction="column"
      css={{
        position: "absolute",
        "z-index": 3,
        width: "100vw",
        transition: "transform 0.2s ease-in-out",
        transform: sidebarDisplay ? "translateX(-101%)" : "translateX(0%)",
        padding: "0",
        margin: "0",
        background: "$accents0",
        height: "100vh",
        float: "left",
        "@xs": {
          position: sidebarDisplay ? "fixed" : "relative",
          maxWidth: "15%",
          minWidth: "250px"
        }
      }}
    >
      <Navbar
        disableShadow
        disableBlur
        containerCss={{
          background: "$accents0",
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
              css={{ flex: "1", $$inputColor: type === "light"? "white" : "#161616" }}
            />
          </Navbar.Item>
        </Navbar.Content>
        <Navbar.Content css={{ display: "flex", "@xs": { display: "none" } }}>
          <Navbar.Item>
            <Button
              auto
              light
              animated={false}
              onPress={handleSidebarDisplay}
              icon={
                <ChevronDoubleRightIcon
                  style={{ height: "var(--icon-size)" }}
                />
              }
            />
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>

      <Container
        css={{
          "overflow-y": "auto",
          "overflow-x": "hidden",
          padding: "0",
          height: "100%"
        }}
      >
        <NoteList
          retrieved_notes={notes}
          showEditor={undefined}
          key={notes}
          handleSidebarDisplay={handleSidebarDisplay}
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
          onPress={() => createNote()}
          css={{ width: "100%" }}
        >
          Add new note
          {console.log(type)}
        </Button>
      </Container>
    </Container>
  );
};

export default NoteSidebar;
