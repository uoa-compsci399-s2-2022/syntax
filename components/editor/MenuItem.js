import { Tooltip, Button, styled } from "@nextui-org/react";

const MenuItem = ({ icon, title, action, isActive = null, css }) => {
  return (
    <Tooltip content={title}>
      <Button
        auto
        className={`menu-item${isActive && isActive() ? " is-active" : ""}`}
        onClick={action}
        icon={icon}
        css={{ ...css, backgroundColor: "transparent" }}
      />
    </Tooltip>
  );
};

export default MenuItem;
