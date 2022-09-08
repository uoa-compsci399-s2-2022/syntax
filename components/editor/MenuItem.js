import { Tooltip, Button, styled } from "@nextui-org/react";

const MenuItem = ({ icon, title, action, isActive = null, isCore = false }) => {
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
        css={isCore ? {} : {display: "none", "@sm": { display: "flex" }}}
      />
    </Tooltip>
  );
};

export default MenuItem;
