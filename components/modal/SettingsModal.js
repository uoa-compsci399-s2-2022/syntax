import { Modal, Grid, Switch, useTheme } from "@nextui-org/react";
import { useTheme as useNextTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

const UserSettingsModal = ({ open, closeHandler }) => {
  const { setTheme } = useNextTheme();
  const { isDark, type } = useTheme();

  return (
    <Modal closeButton open={open} onClose={closeHandler}>
      <Modal.Header>Settings</Modal.Header>
      <Modal.Body>
        <Grid.Container>
          <Grid xs={6}>Colour theme</Grid>
          <Grid xs={6}>
            <Switch
              checked={isDark}
              iconOn={<MoonIcon />}
              iconOff={<SunIcon />}
              onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
            />
          </Grid>
        </Grid.Container>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default UserSettingsModal;
