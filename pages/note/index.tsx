import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { Button, Container, Text } from "@nextui-org/react";
import NoteSidebar from "../../components/note/NoteSidebar";
import NoteNavbar from "../../components/note/NoteNavbar";

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
      <Container
        fluid
        display="flex"
        wrap="nowrap"
        css={{
          "max-height": "100vh",
          "min-width": "100%",
          padding: "0",
          margin: "0",
          overflow: "hidden"
        }}
      >
        <NoteSidebar notes={notes} />
        <Container css={{ padding: "0", "max-height": "100vh", overflow: "auto" }}>
          <NoteNavbar />
          <Container >
            <Text h1>Hello! &#x1f44b;</Text>
            <hr />
            <Text>Create or select a note to get started.</Text>
          </Container>
        </Container>
      </Container>
    </>
  );
}
