import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useState } from "react";
import NotesList from "../components/NotesList";
import NoteSidebar from "../components/NoteSidebar";
import NoteDisplay from "../components/NoteDisplay";
import Editor from "../components/Editor";
import { Button, Container } from "@nextui-org/react";

const getAllNotesByUserID = require("../prisma/Note").getAllNotesByUserID;

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
  if (!session) {
    return (
      <>
        Not signed in <br />
        <Button onClick={() => signIn()}>Sign in</Button>
      </>
    );
  }

  return (
    <>
      <Container display="flex" wrap="nowrap" css={{ "min-height": "100vh", padding: "0", margin: "0" }}>
        <NoteSidebar notes={notes} />
        <Container>
          <Editor />
        </Container>
      </Container>
    </>
  );
}
