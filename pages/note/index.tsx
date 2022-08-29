import NoteLayout from "../../components/note/NoteLayout";
import { useSession, getSession } from "next-auth/react";

const getAllNotesByUserID = require("../../prisma/Note").getAllNotesByUserID;

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });

  if (!session) {
    res.statusCode = 403;
    return { props: { notes: [] } };
  }

  const notes = await getAllNotesByUserID(session?.user?.id);
  console.log({ notes });

  return {
    props: { notes },
  };
};

export default function Component({ notes }) {
  const { data: session, status } = useSession();

  return (
    <NoteLayout
      allNotes={notes}
      currentNote={{
        title: "Hello! 👋",
        body: "Create or select a note to get started.",
      }}
    />
  );
}
