import Head from "next/head";
import NoteNavbar from "./NoteNavbar";
import { Container, Text, Spacer, Grid } from "@nextui-org/react";
import ImageEditor from '../ImageEditor'
import Tiptap from '../Tiptap'

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
          <Container css={{ margin: "0", padding: "0 3rem", "max-width": "100vw" }}>
            <Text h1>{note.title}</Text>
            <Grid.Container>
              <Grid xs={1.5}><Text weight="bold">Created by</Text></Grid>
              <Grid xs={10}>John Doe</Grid>
              <Grid xs={1.5}><Text weight="bold">Last modified</Text></Grid>
              <Grid xs={10}>Mon 29 Aug 4:12 PM</Grid>
            </Grid.Container>
            <Spacer />
            <hr />
            {/*<ImageEditor/>*/}
            <Tiptap noteContent={note.body} key={note.title}/>
          </Container>
          <Spacer />
        </Container>
      </>
    );
  }
};

export default NoteDisplay;
