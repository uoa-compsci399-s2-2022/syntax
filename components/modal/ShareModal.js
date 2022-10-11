import { Button, Modal, Input, Spacer, Text, Grid} from "@nextui-org/react";
const share_link = 'Insert Link Here';

const ShareModal = ({ open, onclosehandler, closeHandler }) => {
	return (
		<Modal blur width='500px' open={open} onClose={onclosehandler} css={{ margin: "10px"}}>
			<Modal.Header><Text size='$2xl'>Invite others to collaborate with on this note!</Text></Modal.Header>
			<Modal.Body>
					<Grid.Container>
						<Grid xs={9} sm={9.9} xl>
							<Input clearable bordered
						width='89%'
						label="Enter their email here"/>
						</Grid>
						<Grid auto>
							<Spacer y={1.3}/>
							<Button auto xs onPress={onclosehandler}>
							Invite
						</Button>
						</Grid>
					</Grid.Container>
					<Spacer y={1}/>
                    <hr></hr>
					
					<Input width='83%' readOnly
					label="Don't know their email? Share this link!"
					placeholder='Share Link TextBox' 
					className='cliptext' initialValue={share_link} contentRight={<Button auto responsive onPress={() => {navigator.clipboard.writeText(share_link)}}>Copy Link</Button>}/>
			</Modal.Body>
			<Modal.Footer>
				
				<Button auto bordered flat color="error" onPress={onclosehandler}>
					No
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ShareModal;
