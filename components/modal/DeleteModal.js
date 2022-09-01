import { Button, Modal } from "@nextui-org/react";

const DeleteModal = ({ open, closeHandler }) => {
  return (
    <Modal open={open} onClose={closeHandler}>
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
  );
};

export default DeleteModal;
