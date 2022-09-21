import {
  Modal,
  Input,
  Button,
  Dropdown,
  Container,
  Row
} from "@nextui-org/react";
import { useState } from "react";
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

  {
    /* Filler content to preview the modal with scrollbar */
  }
  const exampleNotes = [
    { title: "Note Title 1", updatedAt: "Date" },
    { title: "Note Title 2", updatedAt: "Date" },
    { title: "Note Title 3", updatedAt: "Date" },
    { title: "Note Title 4", updatedAt: "Date" },
    { title: "Note Title 5", updatedAt: "Date" },
    { title: "Note Title 6", updatedAt: "Date" },
    { title: "Note Title 7", updatedAt: "Date" },
    { title: "Note Title 8", updatedAt: "Date" },
    { title: "Note Title 9", updatedAt: "Date" },
    { title: "Note Title 10", updatedAt: "Date" },
    { title: "Note Title 11", updatedAt: "Date" },
    { title: "Note Title 12", updatedAt: "Date" },
    { title: "Note Title 13", updatedAt: "Date" },
    { title: "Note Title 14", updatedAt: "Date" },
    { title: "Note Title 15", updatedAt: "Date" },
    { title: "Note Title 16", updatedAt: "Date" },
    { title: "Note Title 17", updatedAt: "Date" },
    { title: "Note Title 18", updatedAt: "Date" }
  ];

  return (
    <Modal
      blur
      scroll
      closeButton
      open={open}
      onClose={closeHandler}
      width="600px"
      css={{ margin: "10px" }}
    >
      <Modal.Header
        css={{
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "16px",
          borderBottom: "1px solid $border",
          marginTop: "16px",
          paddingBottom: "16px"
        }}
      >
        <Input
          clearable
          aria-label="Advanced Search Bar"
          placeholder="Search notes..."
          type="search"
          animated={false}
          contentLeft={
            <MagnifyingGlassIcon style={{ height: "var(--icon-size)" }} />
          }
          css={{ width: "100%" }}
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
            css={{ border: "2px solid $primary" }}
          >
            Title
          </Button>
          <Button
            auto
            bordered={contentChecked ? false : true}
            onPress={() => setContentChecked(!contentChecked)}
            css={{ border: "2px solid $primary" }}
          >
            Content
          </Button>
          <Button
            auto
            bordered={codeChecked ? false : true}
            onPress={() => setCodeChecked(!codeChecked)}
            css={{ border: "2px solid $primary" }}
          >
            Code
          </Button>
        </Container>
      </Modal.Header>
      <Modal.Body>
        {exampleNotes.length > 0 ? (
          <>
            <Dropdown>
              <Dropdown.Button
                light
                animated="false"
                css={{
                  paddingLeft: "10px",
                  margin: "0",
                  width: "min-content",
                  minHeight: "36px"
                }}
              >
                {sortOptions[selectedSort]}
              </Dropdown.Button>
              <Dropdown.Menu
                aria-label="Sort Options"
                onAction={setSelectedSort}
              >
                {Object.keys(sortOptions).map((option) => (
                  <Dropdown.Item key={option}>
                    {sortOptions[option]}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <a>
              <Container css={{ padding: "0" }}>
                {exampleNotes.map((note, index) => (
                  <Container
                    key={note.title + index}
                    css={{
                      padding: "10px",
                      borderRadius: "12px",
                      "&:hover": {
                        background: "$background"
                      }
                    }}
                  >
                    <Row>{note.title}</Row>
                    <Row css={{ color: "$accents6" }}>{note.updatedAt}</Row>
                  </Container>
                ))}
              </Container>
            </a>
          </>
        ) : (
          <Container display="flex" justify="center">
            No results
          </Container>
        )}
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default SearchModal;
