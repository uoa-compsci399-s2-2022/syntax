import { useSession, signIn, signOut, getSession, SessionProvider } from "next-auth/react"

import { useState } from "react";

import Head from "next/head";
import dynamic from "next/dynamic";

import NotesList from "../components/NotesList";
import Editor from "../components/Editor";

const getAllNotesByUserID = require("../prisma/Note").getAllNotesByUserID;

export const getServerSideProps = async ({ req, res }) => {
	const session = await getSession({ req });
 
	if (!session) {
	  res.statusCode = 403;
	  return { props: { notes: [] } };
	}
 
	const notes = await getAllNotesByUserID(session?.user?.id);
	console.log({notes});
 
	return {
	  props: { notes },
	};
 };

export default function Component({ notes }) {
	const [showEditor, setShowEditor] = useState(true);
   const {data: session, status } = useSession()
	if (!session) {
		return (
			<>
			Not signed in <br />
			<button onClick={() => signIn()}>Sign in</button>
		 </>
		);
	 }
	
    
    return (
    <>
      Signed in as {session.user.email} <br />
      <button onClick={() => signOut()}>Sign out</button>
		{showEditor && <Editor />}
      <NotesList retrieved_notes={notes} showEditor={undefined} />
    </>
    )
  
}