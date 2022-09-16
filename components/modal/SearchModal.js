import { Modal, Input, Button, Dropdown, Container } from "@nextui-org/react";
import { useState, useEffect } from "react";

const SearchModal = ({ open, closeHandler }) => {
  const [selectedSort, setSelectedSort] = useState();
  const [selectedGroup, setSelectedGroup] = useState();

  const sortOptions = {
    "title-asc": "Title (ascending)",
    "title-desc": "Title (descending)",
    "edited-asc": "Edited (ascending)",
    "edited-desc": "Edited (descending)",
    "created-asc": "Created (ascending)",
    "created-desc": "Created (descending)"
  };
  const defaultSort = "title-asc";

  return (
    <Modal
      closeButton
      open={open}
      onClose={closeHandler}
      width="600px"
      css={{ margin: "10px" }}
    >
      <Modal.Header>Advanced Search</Modal.Header>
      <Modal.Body>
        <Input clearable animated={false} label="Title" placeholder="Title" />
        <Input
          clearable
          animated={false}
          label="Note Content"
          placeholder="Note Content"
        />
        <Container display="flex" css={{ padding: "0", gap: "10px" }}>
          <Dropdown>
            <Dropdown.Button bordered css={{ flex: "1" }}>
              In Group: {selectedGroup ? selectedGroup : "Any"}
            </Dropdown.Button>
            <Dropdown.Menu
              aria-label="Group Options"
              onAction={setSelectedGroup}
            >
              <Dropdown.Item key="group1">Group 1</Dropdown.Item>
              <Dropdown.Item key="group2">Group 2</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown>
            <Dropdown.Button bordered css={{ flex: "1" }}>
              Sort by: {selectedSort ? sortOptions[selectedSort] : sortOptions[defaultSort]}
            </Dropdown.Button>
            <Dropdown.Menu aria-label="Sort Options" onAction={setSelectedSort}>
            {Object.keys(sortOptions).map((option) => (
              <Dropdown.Item key={option}>
                {sortOptions[option]}
              </Dropdown.Item>
            ))}
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button auto bordered onClick={closeHandler}>
          Search
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SearchModal;
