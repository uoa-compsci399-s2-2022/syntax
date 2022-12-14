import { Button, Modal, Input, useInput, useTheme } from "@nextui-org/react";
import { useState } from "react";

const InputModal = ({ open, closeHandler, inputType }) => {
	const { checked, type } = useTheme();
	const { value, reset, bindings } = useInput("");
	const [helperText, setHelperText] = useState();

	const closeHelper = (value) => {
		setHelperText();
		reset();
		closeHandler(value);
	};

	const typeValues = {
		video: {
			header: "Add Video",
			label: "Video URL",
			placeholder: "Paste Youtube URL"
		},
		link: {
			header: "Add Link",
			label: "Link",
			placeholder: "Paste link"
		}
	};

	if (inputType) {
		return (
			<Modal blur open={open} onClose={closeHelper} css={{ margin: "10px" }}>
				<Modal.Header>{typeValues[inputType].header}</Modal.Header>
				<Modal.Body css={{ minHeight: "100px" }}>
					<Input
						{...bindings}
						clearable
						animated={false}
						label={typeValues[inputType].label}
						helperText={helperText}
						helperColor="error"
						placeholder={typeValues[inputType].placeholder}
						css={{$$inputColor: type === "dark" ? "var(--nextui-colors-background)" : "var(--nextui-colors-accents0)"}}
					/>
				</Modal.Body>
				<Modal.Footer>
					<Button
						auto
						onPress={() => {
							if (!value || value === "") {
								setHelperText("Value is required");
							} else {
								closeHelper(value);
							}
						}}
					>
						{inputType === "group" ? "Confirm": "Insert"}
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
	} else {
		return "";
	}
};

export default InputModal;
