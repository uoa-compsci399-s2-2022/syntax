import { Button, Modal } from "@nextui-org/react";

const DeleteModal = ({ open, onclosehandler, closeHandler }) => {
  return (
    <Modal open={open} onClose={onclosehandler} css={{ margin: "10px" }}>
      <Modal.Header>Delete Note</Modal.Header>
      <Modal.Body>
        Are you sure you want to delete this note?
        <br />
        This action cannot be undone.
      </Modal.Body>
      <Modal.Footer>
        <Button auto bordered onPress={() => closeHandler()}>
          Yes
        </Button>
        <Button auto bordered flat color="error" onPress={onclosehandler}>
          No
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
