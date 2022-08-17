import Head from "next/head";
import Image from "next/image";

import { getSession } from "next-auth/react";

const getNoteByID = require("../../prisma/Note").getNoteByID;

export const getServerSideProps = async ({ req, res, params }) => {
  const session = await getSession({ req });
  console.log({ params });
  const { id } = params;

  if (!session) {
    res.statusCode = 403;
    return { props: { note: null } };
  }

  const note = await getNoteByID(id);
  console.log({ note });

  return {
    props: { note },
  };
};

const Note = ({ note }) => {
  if (note == null) {
    return (
      <>
        <Head>
          <title>Login to view note</title>
          <meta name="description" content="Login to view this note" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

              <h1 >Oops... You have to login to view this note</h1>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{note.title}</title>
        <meta name="description" content={`By ${note.user.name}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      
              <h2 >{note.title}</h2>
           
              <p >{note.body}</p>
            
    </>
  );
};

export default Note;
