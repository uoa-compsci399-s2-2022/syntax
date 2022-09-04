import { Button, Modal } from "@nextui-org/react";

const ExportModal = ({ open, closeHandler }) => {
  return (
    <Modal open={open} onClose={closeHandler}>
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
  );
};

export default ExportModal;