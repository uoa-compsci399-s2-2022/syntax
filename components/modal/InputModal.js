import { Button, Modal, Input } from "@nextui-org/react";

const InputModal = ({ open, closeHandler, inputType }) => {
  return (
    <Modal blur open={open} onClose={closeHandler} css={{ margin: "10px" }}>
      <Modal.Header>Add {inputType}</Modal.Header>
      <Modal.Body>
        <Input
          bordered
          clearable
          animated={false}
          label="Video URL"
          placeholder="Paste in Youtube URL"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button auto bordered >
          Insert
        </Button>
        <Button auto bordered flat color="error" >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InputModal;
