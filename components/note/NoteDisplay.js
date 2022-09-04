import Head from "next/head";
import { Container, Text, Spacer, Grid } from "@nextui-org/react";
import ImageEditor from "@/components/editor/ImageEditor";
import Tiptap from "@/components/editor/Tiptap";
import {
  useNote,
  useDispatchNote,
  useNotes,
  useDispatchNotes
} from "@/modules/AppContext";

const NoteDisplay = ({ note, handleSidebarDisplay }) => {
  const notesc = useNotes();
  const setNotes = useDispatchNotes();

  const currentNote = useNote();
  const setCurrentNote = useDispatchNote();
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
          <title>{currentNote.title}</title>
          {/*<meta name="description" content={`By ${note.user.name}`} />*/}
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Container
          css={{
            margin: "0",
            padding: "0 2rem",
            "max-width": "100vw"
          }}
        >
          <Text h1 style={{ "overflow-wrap": "break-word" }}>
            {currentNote.title}
          </Text>
          <table class="note-metadata-table" style={{"text-align": "left"}}>
            <tr>
              <th>Created by</th>
              <td>John Doe</td>
            </tr>
            <tr>
              <th>Last modified</th>
              <td>Mon 29 Aug 4:12 PM</td>
            </tr>
          </table>
          <Spacer />
          <hr />
          {/*<ImageEditor/>*/}
          <Tiptap noteContent={note.body} key={currentNote.title} />
        </Container>
        <Spacer />
      </>
    );
  }
};

export default NoteDisplay;
