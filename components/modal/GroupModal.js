import {
	Button,
	Modal,
	Input,
	Grid,
	useInput,
	useTheme
} from "@nextui-org/react";
import { useState } from "react";

const InputModal = ({
	open,
	closeHandler,
	updateGroupHandler,
	name,
	color
}) => {
	const { checked, type } = useTheme();
	const { value, setValue, reset, bindings } = useInput(name);
	const [helperText, setHelperText] = useState();
	const [selectedColor, setSelectedColor] = useState(color);

	const closeHelper = () => {
		setHelperText();
		setValue(name);
		closeHandler();
	};

	const closeContentHelper = (value) => {
		setHelperText();
		updateGroupHandler(value, selectedColor);
		closeHandler();
	};

	return (
		<Modal blur open={open} onClose={closeHelper} css={{ margin: "10px" }}>
			<Modal.Header>Group Settings</Modal.Header>
			<Modal.Body css={{ minHeight: "100px" }}>
				<Input
					{...bindings}
					clearable
					animated={false}
					label="Name"
					helperText={helperText}
					helperColor="error"
					css={{
						$$inputColor:
							type === "dark"
								? "var(--nextui-colors-background)"
								: "var(--nextui-colors-accents0)"
					}}
				/>
				<Grid.Container
					css={{
						marginTop: "1rem"
					}}
				>
					<Grid xs={6} css={{ fontSize: "$sm", paddingLeft: "4px" }}>
						Color
					</Grid>
					<Grid xs={6} css={{ display: "flex", justifyContent: "flex-end" }}>
						<input
							type="color"
							value={selectedColor}
							onChange={(e) => setSelectedColor(e.target.value)}
						/>
					</Grid>
				</Grid.Container>
			</Modal.Body>
			<Modal.Footer>
				<Button
					auto
					onPress={() => {
						if (!value || value === "") {
							setHelperText("Name is required");
						} else if (value.toLowerCase() === "ungrouped") {
							setHelperText("Invalid name");
						} else {
							closeContentHelper(value);
						}
					}}
				>
					Confirm
				</Button>
				<Button
					auto
					bordered
					flat
					color="error"
					onPress={() => {
						closeHelper();
					}}
				>
					Cancel
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default InputModal;
