import Head from "next/head";
import Tiptap from "../Tiptap";
import NoteNavbar from "./NoteNavbar";
import { Container, Text, Spacer } from "@nextui-org/react";

const NoteDisplay = ({ note }) => {
  if (note == null) {
    return (
      <>
        <Head>
          <title>Login to view note</title>
          <meta name="description" content="Login to view this note" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <h1>Oops... You have to login to view this note</h1>
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>{note.title}</title>
          {/*<meta name="description" content={`By ${note.user.name}`} />*/}
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Container
          fluid
          display="flex"
          direction="column"
          wrap="nowrap"
          css={{
            padding: "0",
            margin: "0",
            "max-height": "100vh",
            "max-width": "100vw",
            "overflow-y": "auto",
          }}
        >
          <NoteNavbar />
          <Container css={{ margin: "0", "max-width": "100vw" }}>
            <Text h1>{note.title}</Text>
            <hr />
            <Spacer />
            <Tiptap noteContent={note.body} />
          </Container>
          <Spacer />
        </Container>
      </>
    );
  }
};

export default NoteDisplay;
