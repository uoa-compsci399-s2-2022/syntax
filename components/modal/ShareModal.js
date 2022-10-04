import { Button, Modal, Input, Spacer, Text} from "@nextui-org/react";

const ShareModal = ({ open, onclosehandler, closeHandler }) => {
	return (
		<Modal blur width='500px' open={open} onClose={onclosehandler} css={{ margin: "10px"}}>
			<Modal.Header><Text size='$2xl'>Invite others to collaborate with on this note!</Text></Modal.Header>
			<Modal.Body>
                <Spacer y={0.1}/>
                    <Input bordered clearable
                    labelPlaceholder="Enter their email here"
                    />
			</Modal.Body>
			<Modal.Footer>
				<Button auto xs onPress={() => closeHandler()}>
					Invite
				</Button>
				<Button auto bordered flat color="error" onPress={onclosehandler}>
					No
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ShareModal;
