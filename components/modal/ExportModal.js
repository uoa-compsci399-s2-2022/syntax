import { Button, Modal, Dropdown } from "@nextui-org/react";
import { useState } from "react";



const ExportModal = ({ open, oncloseHandler, closeHandler }) => {
  const [selected, setSelected] = useState(["HTML"]);
  return (
    <Modal open={open} onClose={oncloseHandler} css={{ margin: "10px" }}>
      <Modal.Header>Export Note</Modal.Header>
      <Modal.Body>Export as 
        <Dropdown>
          <Dropdown.Button flat color="secondary">
            {selected}
          </Dropdown.Button>
          <Dropdown.Menu
            aria-label="Single selection actions"
            color="secondary"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selected}
            onAction={setSelected}
          >
            <Dropdown.Item key="HTML">HTML</Dropdown.Item>
            <Dropdown.Item key="Markdown">Markdown</Dropdown.Item>
            <Dropdown.Item key="PDF">PDF</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Modal.Body>
      <Modal.Footer>
        <Button auto bordered onClick={() => closeHandler(selected)}>
          Export
        </Button>
        <Button auto bordered flat color="error" onPress={oncloseHandler}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExportModal;
