import { Tooltip, Button, styled } from "@nextui-org/react";

const MenuItem = ({ icon, title, action, isActive = null }) => {
  const MarkdownButton = styled(Button, {
    "background-color": "transparent !important",
  });

  return (
    <Tooltip content={title}>
      <MarkdownButton
        auto
        className={`menu-item${isActive && isActive() ? " is-active" : ""}`}
        onClick={action}
        icon={icon}
      />
    </Tooltip>
  );
};

export default MenuItem;
