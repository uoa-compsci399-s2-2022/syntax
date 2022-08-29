import {
  Avatar,
  Dropdown,
  Button,
  Modal,
  Navbar,
  Switch,
  useTheme,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useTheme as useNextTheme } from "next-themes";
import {
  EllipsisHorizontalIcon,
  TrashIcon,
  ShareIcon,
  LockClosedIcon,
  DocumentArrowUpIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

const NoteNavbar = () => {
  const { setTheme } = useNextTheme();
  const { isDark, type } = useTheme();

  const [selectedKey, setSelectedKey] = useState();
  const [exportModal, setExportModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const closeHandler = () => {
    setExportModal(false);
    setDeleteModal(false);
    setSelectedKey();
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
      fluid
      variant="sticky"
      disableShadow
      disableBlur
      containerCss={{
        "min-width": "100%",
        "justify-content": "flex-end"
      }}
    >
      <Navbar.Content gap={5}>
        <Navbar.Item>
          <Avatar
            size="md"
            src="https://cdn3.emoji.gg/emojis/3568-catkiss.gif"
          />
        </Navbar.Item>
        <Navbar.Item>
          <Switch
            checked={isDark}
            onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
          />
        </Navbar.Item>
        <Navbar.Item>
          <Dropdown placement="bottom-right">
            <Dropdown.Trigger>
              <Button
                auto
                light
                icon={<EllipsisHorizontalIcon style={{ height: "30px" }} />}
              />
            </Dropdown.Trigger>
            <Dropdown.Menu
              disabledKeys={["share", "lock"]}
              onAction={setSelectedKey}
            >
              <Dropdown.Item
                key="share"
                icon={<ShareIcon style={{ height: "20px" }} />}
              >
                Share
              </Dropdown.Item>
              <Dropdown.Item
                key="lock"
                icon={<LockClosedIcon style={{ height: "20px" }} />}
              >
                Lock
              </Dropdown.Item>
              <Dropdown.Item
                key="export"
                icon={<DocumentArrowUpIcon style={{ height: "20px" }} />}
              >
                Export
              </Dropdown.Item>
              <Dropdown.Item
                key="delete"
                color="error"
                icon={<TrashIcon style={{ height: "20px" }} />}
              >
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Item>
        <Modal open={exportModal} onClose={closeHandler}>
          <Modal.Header>Export Note</Modal.Header>
          <Modal.Body>Export as PDF / MD</Modal.Body>
          <Modal.Footer>
            <Button auto bordered onClick={closeHandler}>
              Export
            </Button>
            <Button auto bordered flat color="error" onClick={closeHandler}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal open={deleteModal} onClose={closeHandler}>
          <Modal.Header>Delete Note</Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this note?
            <br />
            This action cannot be undone.
          </Modal.Body>
          <Modal.Footer>
            <Button auto bordered onClick={closeHandler}>
              Yes
            </Button>
            <Button auto bordered flat color="error" onClick={closeHandler}>
              No
            </Button>
          </Modal.Footer>
        </Modal>
      </Navbar.Content>
    </Navbar>
  );
};

export default NoteNavbar;
