import { Tooltip, Button, styled } from "@nextui-org/react";

const MenuItem = ({ icon, title, action, isActive = null, isCore = false }) => {
  return (
    <Tooltip content={title}>
      <Button
        auto
        className={`menu-item${isActive && isActive() ? " is-active" : ""}`}
        onClick={action}
        icon={icon}
        css={{
          backgroundColor: "transparent",
          display: isCore ? "flex" : "none",
          "@md": { display: "flex" }
        }}
      />
    </Tooltip>
  );
};

export default MenuItem;
