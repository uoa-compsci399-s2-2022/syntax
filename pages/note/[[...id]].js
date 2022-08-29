import NoteLayout from "../../components/note/NoteLayout"
import { useSession, getSession } from "next-auth/react";
import { useEffect, useState } from 'react';

const getNoteByID = require("../../prisma/Note").getNoteByID;

const getAllNotesByUserID = require("../../prisma/Note").getAllNotesByUserID;

export const getServerSideProps = async ({ req, res, params }) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )
  const session = await getSession({ req });
  const { id } = params;

  if (!session) {
    res.statusCode = 403;
    return { props: { notes: [] } };
  }
  if (id && id.length>1) {
    return {
      notFound: true,
    }
  }

  const notes = await getAllNotesByUserID(session?.user?.id);
  var note;
  if(id && id.length==1){
    note = await getNoteByID(id[0]);
  }else{
    note = {title: "default",
      body: "start typing"};
  }
  // console.log(note)
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
