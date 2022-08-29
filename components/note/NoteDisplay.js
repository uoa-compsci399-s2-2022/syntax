import Head from "next/head";
import Tiptap from "../Tiptap";
import NoteNavbar from "./NoteNavbar";
import { Container, Text } from "@nextui-org/react";

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
    // console.log(note);
    return (
      <>
        <Head>
          <title>{note.title}</title>
          {/*<meta name="description" content={`By ${note.user.name}`} />*/}
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Container
          css={{ padding: "0", "max-height": "100vh", "overflow-y": "auto" }}
        >
          <NoteNavbar />
          <Container>
            <Text h1>{note.title}</Text>
            <hr />
            <Tiptap noteContent={note.body} key={note.title}/>
          </Container>
        </Container>
      </>
    );
  }
};

export default NoteDisplay;
