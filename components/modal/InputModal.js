import { Button, Modal, Input, useInput } from "@nextui-org/react";
import { useState } from "react";

const InputModal = ({ open, closeHandler, inputType }) => {
	const { value, reset, bindings } = useInput("");
	const [helperText, setHelperText] = useState();

	const closeHelper = (value) => {
		setHelperText();
		reset();
		closeHandler(value);
	};

	return (
		<Modal blur open={open} onClose={closeHelper} css={{ margin: "10px" }}>
			<Modal.Header css={{ tt: "capitalize" }}>Add {inputType}</Modal.Header>
			<Modal.Body css={{ minHeight: "100px" }}>
				<Input
					{...bindings}
					bordered
					clearable
					animated={false}
					label={inputType === "video" ? "Video URL" : "Link"}
					helperText={helperText}
					helperColor="error"
					placeholder={
						`Paste ${inputType === "video" ? "Youtube URL" : "link"}`
					}
				/>
			</Modal.Body>
			<Modal.Footer>
				<Button
					auto
					bordered
					onPress={() => {
						if (!value || value === "") {
							setHelperText("URL is required");
						} else {
							closeHelper(value);
						}
					}}
				>
					Insert
				</Button>
				<Button
					auto
					bordered
					flat
					color="error"
					onPress={() => {
						closeHelper(null);
					}}
				>
					Cancel
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default InputModal;
