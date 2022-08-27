import Head from "next/head";
import Tiptap from "../components/Tiptap";
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
      }
    else {
      return (
        <Container>
          <Head>
            <title>{note.title}</title>
            <meta name="description" content={`By ${note.user.name}`} />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <h2>{note.title}</h2>
          <Tiptap noteContent={note.body} />
        </Container>
      );
    }
}

export default NoteDisplay;