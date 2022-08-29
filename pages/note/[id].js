import NoteLayout from "../../components/note/NoteLayout"
import { useSession, getSession } from "next-auth/react";

const getNoteByID = require("../../prisma/Note").getNoteByID;

const getAllNotesByUserID = require("../../prisma/Note").getAllNotesByUserID;

export const getServerSideProps = async ({ req, res, params }) => {
  const session = await getSession({ req });
  console.log({ params });
  const { id } = params;

  if (!session) {
    res.statusCode = 403;
    return { props: { notes: [] } };
  }

  const notes = await getAllNotesByUserID(session?.user?.id);
  console.log({ notes });

  const note = await getNoteByID(id);
  console.log({ note });

  return {
    props: { notes, note },
  };
};

export default function Note({ notes, note }) {
  const { data: session, status } = useSession();

  return (
    <NoteLayout allNotes={notes} currentNote={note} />
  );
}
