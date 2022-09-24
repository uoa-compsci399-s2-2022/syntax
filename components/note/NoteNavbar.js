import ExportModal from "@/components/modal/ExportModal";
import DeleteModal from "@/components/modal/DeleteModal";
import SettingsModal from "@/components/modal/SettingsModal";
import { Avatar, Dropdown, Button, Navbar } from "@nextui-org/react";
import { useState, useEffect } from "react";
import {
  EllipsisHorizontalIcon,
  TrashIcon,
  ShareIcon,
  LockClosedIcon,
  DocumentArrowUpIcon,
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon
} from "@heroicons/react/24/solid";
import {
  useNote,
  useDispatchNote,
  useNotes,
  useDispatchNotes
} from "../../modules/AppContext";

const NoteNavbar = ({ sidebarDisplay, handleSidebarDisplay }) => {
  const [selectedKey, setSelectedKey] = useState();
  const [exportModal, setExportModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const currentNote = useNote();
  const setNotes = useDispatchNotes();

  const closeHandler = () => {
    setSettingsModal(false);
    setExportModal(false);
    setDeleteModal(false);
    setSelectedKey();
  };

  const deleteNoteHandler = async () => {
    try {
      console.log(currentNote);
      let res = await fetch(`/api/note`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentNote.id)
      });
      const deletedNote = await res.json();
      setNotes({ note: deletedNote, type: "remove" });
      setDeleteModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    switch (selectedKey) {
      case "export":
        setExportModal(true);
        break;
      case "delete":
        setDeleteModal(true);
        break;
    }
  }, [selectedKey]);

  return (
    <Navbar
      variant="sticky"
      disableShadow
      disableBlur
      css={{ zIndex: 2 }}
      containerCss={{
        minWidth: "100%"
      }}
    >
      <Navbar.Content>
        <Navbar.Item css={{ display: "none", "@xs": { display: "flex" } }}>
          <Button
            auto
            light
            animated={false}
            onPress={handleSidebarDisplay}
            icon={
              sidebarDisplay ? (
                <ChevronDoubleRightIcon
                  style={{ height: "var(--icon-size)" }}
                />
              ) : (
                <ChevronDoubleLeftIcon style={{ height: "var(--icon-size)" }} />
              )
            }
          />
        </Navbar.Item>
        <Navbar.Item css={{ display: "flex", "@xs": { display: "none" } }}>
          <Button
            auto
            light
            animated={false}
            onPress={handleSidebarDisplay}
            icon={
              <ChevronDoubleLeftIcon style={{ height: "var(--icon-size)" }} />
            }
          >
            All Notes
          </Button>
        </Navbar.Item>
      </Navbar.Content>
      <Navbar.Content gap={5}>
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
        <Navbar.Item>
          <Dropdown placement="bottom-right">
            <Dropdown.Button
              light
              icon={<EllipsisHorizontalIcon style={{ height: "30px" }} />}
            />
            <Dropdown.Menu
              disabledKeys={["share", "lock"]}
              onAction={setSelectedKey}
              aria-label="Note Options"
            >
              <Dropdown.Item
                key="share"
                icon={<ShareIcon style={{ height: "var(--icon-size-s)" }} />}
              >
                Share
              </Dropdown.Item>
              <Dropdown.Item
                key="lock"
                icon={
                  <LockClosedIcon style={{ height: "var(--icon-size-s)" }} />
                }
              >
                Lock
              </Dropdown.Item>
              <Dropdown.Item
                key="export"
                icon={
                  <DocumentArrowUpIcon
                    style={{ height: "var(--icon-size-s)" }}
                  />
                }
              >
                Export
              </Dropdown.Item>
              <Dropdown.Item
                key="delete"
                color="error"
                icon={<TrashIcon style={{ height: "var(--icon-size-s)" }} />}
              >
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Item>
        <ExportModal open={exportModal} closeHandler={closeHandler} />
        <DeleteModal
          open={deleteModal}
          onclosehandler={closeHandler}
          closeHandler={deleteNoteHandler}
        />
        <SettingsModal open={settingsModal} closeHandler={closeHandler} />
      </Navbar.Content>
    </Navbar>
  );
};

export default NoteNavbar;
