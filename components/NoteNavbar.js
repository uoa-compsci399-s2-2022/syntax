import { Container, Avatar, Dropdown, Button, Modal } from "@nextui-org/react";
import {
  EllipsisHorizontalIcon,
  TrashIcon,
  ShareIcon,
  LockClosedIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

const NoteNavbar = () => {
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
    <Container
      fluid
      display="flex"
      wrap="nowrap"
      justify="flex-end"
      alignItems="center"
      css={{ gap: "20px", padding: "0" }}
    >
      <Avatar size="md" src="https://cdn3.emoji.gg/emojis/3568-catkiss.gif" />
      <Dropdown placement="bottom-right">
        <Dropdown.Trigger>
          <Button
            auto
            color="warning"
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
            icon={<DocumentTextIcon style={{ height: "20px" }} />}
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
      <Modal open={exportModal} onClose={closeHandler}>
        <Modal.Header>Export Note</Modal.Header>
        <Modal.Body>Export as ...</Modal.Body>
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
    </Container>
  );
};

export default NoteNavbar;
