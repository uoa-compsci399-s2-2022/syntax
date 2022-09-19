import {
  Modal,
  Input,
  Button,
  Dropdown,
  Container,
  Row,
  Text
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const SearchModal = ({ open, closeHandler }) => {
  const [selectedSort, setSelectedSort] = useState("title-asc");
  const [titleChecked, setTitleChecked] = useState(true);
  const [contentChecked, setContentChecked] = useState(false);
  const [codeChecked, setCodeChecked] = useState(false);

  const sortOptions = {
    "title-asc": "Title (ascending)",
    "title-desc": "Title (descending)",
    "modified-asc": "Modified (ascending)",
    "modified-desc": "Modified (descending)",
    "created-asc": "Created (ascending)",
    "created-desc": "Created (descending)"
  };

  const exampleNotes = [
    { title: "Test 1", updatedAt: "Date" },
    { title: "Test 2", updatedAt: "Date" },
    { title: "Test 3", updatedAt: "Date" }
  ];

  return (
    <Modal
      blur
      closeButton
      open={open}
      onClose={closeHandler}
      width="600px"
      css={{ margin: "10px" }}
    >
      <Modal.Header>Advanced Search</Modal.Header>
      <Modal.Body>
        <Input
          clearable
          aria-label="Advanced Search Bar"
          placeholder="Search content..."
          type="search"
          animated={false}
          contentLeft={
            <MagnifyingGlassIcon style={{ height: "var(--icon-size)" }} />
          }
        />
        <Container
          display="flex"
          wrap="nowrap"
          css={{ padding: "0", gap: "10px" }}
        >
          <Button
            auto
            bordered={titleChecked ? false : true}
            onPress={() => setTitleChecked(!titleChecked)}
          >
            Title
          </Button>
          <Button
            auto
            bordered={contentChecked ? false : true}
            onPress={() => setContentChecked(!contentChecked)}
          >
            Content
          </Button>
          <Button
            auto
            bordered={codeChecked ? false : true}
            onPress={() => setCodeChecked(!codeChecked)}
          >
            Code
          </Button>
        </Container>
        <hr style={{ marginBottom: "0" }} />
        <Dropdown>
          <Dropdown.Button
            light
            animated="false"
            css={{ width: "min-content", padding: "0" }}
          >
            {sortOptions[selectedSort]}
          </Dropdown.Button>
          <Dropdown.Menu aria-label="Sort Options" onAction={setSelectedSort}>
            {Object.keys(sortOptions).map((option) => (
              <Dropdown.Item key={option}>{sortOptions[option]}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Container css={{ padding: "0" }}>
          {exampleNotes.map((note, index) => (
            <Row>
              <Text h4>{note.title}</Text>
              <Text>{note.updatedAt}</Text>
            </Row>
          ))}
        </Container>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default SearchModal;
