import { Card, Text } from "@nextui-org/react";

const NoteCard = ({ note }) => {
  return (
  <Card isPressable >
    <Card.Header><Text h3>{note.title}</Text></Card.Header>
    <Card.Body css={{ "padding-top": "0" }}>{note.body}</Card.Body>
  </Card>
  )
};

export default NoteCard;
