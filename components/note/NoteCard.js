import { Card, Text } from "@nextui-org/react";

const NoteCard = ({ note }) => {
  return (
    <Card isPressable variant="flat" css={{ background: "$background"}}>
      <Card.Header css={{ "padding-bottom": "0" }}>
        <Text h3>{note.title}</Text>
      </Card.Header>
      <Card.Body css={{ "padding-top": "0" }}>
        {(note.body.length > 50) ? (note.body.slice(0, 50) + "...") : note.body}
      </Card.Body>
    </Card>
  );
};

export default NoteCard;
