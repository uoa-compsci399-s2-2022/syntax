import { Card, Text } from "@nextui-org/react";

const NoteCard = ({ note }) => {
  return (
    <Card
      isPressable
      variant="flat"
      css={{ background: "$background", "line-height": "1", "border-radius": "0" }}
    >
      <Card.Body>
      <Text h4>{note.title}</Text>
      </Card.Body>
    </Card>
  );
};

export default NoteCard;
