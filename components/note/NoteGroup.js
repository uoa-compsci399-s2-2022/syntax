import { Collapse, Text, Avatar } from "@nextui-org/react";

const NoteGroup = ({ name, color = "white", notes, openNote }) => {
  return (
    <Collapse
      title={<Text>{name}</Text>}
      contentLeft={
        <svg height="10" width="10">
          <circle cx="5" cy="5" r="5" fill={color} />
        </svg>
      }
      css={{ padding: "0" }}
    >
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <a
              onClick={() => {
                openNote(note);
              }}
            >
              {note.title}
            </a>
          </li>
        ))}
      </ul>
    </Collapse>
  );
};

export default NoteGroup;
