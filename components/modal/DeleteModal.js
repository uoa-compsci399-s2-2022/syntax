import { Button, Modal } from "@nextui-org/react";

const DeleteModal = ({ open, onclosehandler, closeHandler, type }) => {
	return (
		<Modal blur open={open} onClose={onclosehandler} css={{ margin: "10px" }}>
			<Modal.Header css={{ tt: "capitalize" }}>Delete {type}</Modal.Header>
			<Modal.Body>
				Are you sure you want to delete this {type}?
				<br />
				This action cannot be undone.
			</Modal.Body>
			<Modal.Footer>
				<Button auto onPress={() => closeHandler()}>
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
