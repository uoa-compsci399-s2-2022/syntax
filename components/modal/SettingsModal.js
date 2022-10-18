import { Modal, Grid, Switch, Button, useTheme } from "@nextui-org/react";
import { useTheme as useNextTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { signOut } from "next-auth/react";

const UserSettingsModal = ({ open, closeHandler }) => {
	const { setTheme } = useNextTheme();
	const { isDark, type } = useTheme();

	return (
		<Modal
			blur
			closeButton
			open={open}
			onClose={closeHandler}
			css={{ margin: "10px" }}
		>
			<Modal.Header>Settings</Modal.Header>
			<Modal.Body>
				<Grid.Container>
					<Grid xs={6}>Colour theme</Grid>
					<Grid xs={6} css={{ display: "flex", justifyContent: "flex-end" }}>
						<Switch
							checked={isDark}
							iconOn={<MoonIcon />}
							iconOff={<SunIcon />}
							onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
						/>
					</Grid>
				</Grid.Container>
				<Button onPress={() => signOut()} css={{marginTop: "1rem"}}>Sign Out</Button>
			</Modal.Body>
			<Modal.Footer></Modal.Footer>
		</Modal>
	);
};

export default UserSettingsModal;
