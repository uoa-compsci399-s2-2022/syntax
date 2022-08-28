import { Container, Avatar, Dropdown, Button } from "@nextui-org/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

const NoteNavbar = () => {
  return (
    <Container
      fluid
      display="flex"
      wrap="nowrap"
      justify="flex-end"
      alignItems="center"
      css={{ gap: "20px", padding: "0" }}
    >
      <Avatar size="sm" color="primary" />
      <Dropdown placement="bottom-right">
        <Dropdown.Trigger>
          <Button auto light icon={<EllipsisHorizontalIcon style={{ height: "24px" }} />} />
        </Dropdown.Trigger>
        <Dropdown.Menu>
          <Dropdown.Item key="share">Share note</Dropdown.Item>
          <Dropdown.Item key="lock">Lock note</Dropdown.Item>
          <Dropdown.Item key="export">Export note</Dropdown.Item>
          <Dropdown.Item key="delete" color="error">
            Delete note
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Container>
  );
};

export default NoteNavbar;
