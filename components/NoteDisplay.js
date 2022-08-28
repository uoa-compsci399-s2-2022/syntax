import Head from "next/head";
import Tiptap from "../components/Tiptap";
import NoteNavbar from "../components/NoteNavbar";
import { Container } from "@nextui-org/react";

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
          <meta name="description" content={`By ${note.user.name}`} />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Container css={{ padding: "20px" }}>
          <NoteNavbar />
          <Container>
            <h2>{note.title}</h2>
            <Tiptap noteContent={note.body} />
          </Container>
        </Container>
      </>
    );
  }
};

export default NoteDisplay;
