import NoteLayout from "../../components/note/NoteLayout";
import { useSession, getSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import { unstable_batchedUpdates } from "react-dom"; 
import {
	useNote,
	useDispatchNote,
	useNotes,
	useDispatchNotes,
} from "../../modules/AppContext";
import { useRouter } from 'next/router';
import { NoteTemplate } from '../../components/note/NewNote'

const getNoteByID = require("../../prisma/Note").getNoteByID;
const getAllNotesByUserID = require("../../prisma/Note").getAllNotesByUserID;

export const getServerSideProps = async ({ req, res, params }) => {
	// res.setHeader(
	// 	"Cache-Control",
	// 	"public, s-maxage=10, stale-while-revalidate=59"
	// );
	const session = await getSession({ req });
	const { id } = params;

	if (!session) {
		res.statusCode = 403;
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		}
	}
	if (id && id.length > 1) {
		return {
			notFound: true,
		};
	}
	var note;
	if (id && id.length == 1) {
		note = await getNoteByID(id[0]);
		if (!note) {
			return {
				redirect: {
					destination: '/note',
					permanent: false,
				},
			}
		}
	} else {
		note = {
			...NoteTemplate,
			updatedAt: Date.now(),
			user: session?.user,
		};
	}
	const [notes] = await getAllNotesByUserID(session?.user?.id);

	return {
		props: { notes, note },
	};
};


export default function Note({ notes, note }) {
	const { data: session, status } = useSession();
	const notesc = useNotes();
	const setNotes = useDispatchNotes();
	const currentNote = useNote();
	const setCurrentNote = useDispatchNote();
	useEffect(() => {
		if (Object.keys(currentNote).length == 0) {
			note.action = "edit";
			setCurrentNote(note);
		}
	}, [])


	return <NoteLayout allNotes={notes} currentNote={note} />;
}
