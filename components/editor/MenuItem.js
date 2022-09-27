import { Tooltip, Button, styled } from "@nextui-org/react";

const MenuItem = ({ icon, label, action, isActive = null, css, breakpoint }) => {
  const breakpointStyle = {}
  if (breakpoint) {
    if (breakpoint === "sm") {
      breakpointStyle = { display: "none", "@sm": { display: "flex" } }
    } else if (breakpoint === "md") {
      breakpointStyle = { display: "none", "@md": { display: "flex" } }
    }
  }

  return (
    <Tooltip content={label}>
      <Button
        auto
        className={`menu-item${isActive && isActive() ? " is-active" : ""}`}
        onPress={action}
        icon={icon}
        css={{ ...css, ...breakpointStyle, backgroundColor: "transparent" }}
      />
    </Tooltip>
  );
};

export default MenuItem;
