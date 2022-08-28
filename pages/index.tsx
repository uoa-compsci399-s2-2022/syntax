import { useSession, signIn, signOut, getSession } from "next-auth/react"
import { useState } from "react";
import ImageEditor from '../components/ImageEditor'
import { Button } from '@nextui-org/react';

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
	const [showEditor, setShowEditor] = useState(true);
	const { data: session, status } = useSession()
	if (!session) {
		return (
			<>
				Not signed in <br />
				<Button onClick={() => signIn()}>Sign in</Button>
			</>
		);
	}

	return (
		<>
			Signed in as {session.user.email} <br />
			<Button onClick={() => signOut()}>Sign out</Button>
			<ImageEditor/>
        </>
	)
}