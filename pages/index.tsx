import { useSession, signIn, signOut, getSession } from "next-auth/react"
import Tiptap from '../components/Tiptap'
import { Button, Input } from '@nextui-org/react';
import NotesList from "../components/NotesList";

const getAllNotesByUserID = require("../prisma/Note").getAllNotesByUserID;

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
	const { data: session } = useSession()
	if (!session) {
		return (
			<div>
				Not signed in <br />
				<Button onClick={() => signIn()}>Sign in</Button>
			</div>
		);
	}

	return (
		<div>
			Signed in as {session.user.email} <br />
			<Button onClick={() => signOut()}>Sign out</Button>
			<Tiptap />
			<NotesList retrieved_notes={notes}/>
        </div>
	)
}