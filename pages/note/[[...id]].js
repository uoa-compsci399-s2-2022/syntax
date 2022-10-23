import NoteDisplay from "../../components/note/NoteDisplay";
import NoteSidebar from "../../components/note/NoteSidebar";
import NoteNavbar from "../../components/note/NoteNavbar";
import Head from "next/head";
import { useSession, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { NoteTemplate } from "../../components/note/NewNote";
import { Container, useTheme } from "@nextui-org/react";
import { useDispatchNote, useDispatchNotes } from "../../modules/AppContext";

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
				destination: "/",
				permanent: false
			}
		};
	}
	if (id && id.length > 1) {
		return {
			notFound: true
		};
	}
	var note;
	if (id && id.length == 1) {
		note = await getNoteByID(id[0]);
		if (!note) {
			return {
				redirect: {
					destination: "/note",
					permanent: false
				}
			};
		}
	} else {
		note = {
			...NoteTemplate,
			updatedAt: Date.now(),
			user: session?.user,
			action: "edit"
		};
	}
	const [notes] = await getAllNotesByUserID(session?.user?.id);
	console.log(note);
	return {
		props: { notes, note }
	};
};

const NoteLayout = ({ notes, note }) => {
	const [sidebarDisplay, setSidebarDisplay] = useState(false);
	const { isDark, type } = useTheme();
	const { data: session, status } = useSession();
	const setCurrentNote = useDispatchNote();
	const setNotes = useDispatchNotes();
	useEffect(() => {
		setCurrentNote(note);
		setNotes({ note: notes, type: "replace" });
	}, []);

	const handleSidebarDisplay = () => {
		setSidebarDisplay((current) => !current);
	};

	return (
		<>
			<Head>
				<title>{note.title}</title>
				<meta name="theme-color" content={isDark ? "#121212" : "white"} />
			</Head>
			<Container
				fluid
				display="flex"
				wrap="nowrap"
				css={{
					minWidth: "100vw",
					minHeight: "100vh",
					padding: "0",
					margin: "0"
				}}
			>
				<NoteSidebar
					sidebarDisplay={sidebarDisplay}
					handleSidebarDisplay={handleSidebarDisplay}
				/>
				<Container
					display="flex"
					direction="column"
					wrap="nowrap"
					css={{
						padding: "0",
						margin: "0",
						maxHeight: "100vh",
						maxWidth: "100vw",
						overflow: "hidden"
					}}
				>
					<NoteNavbar
						sidebarDisplay={sidebarDisplay}
						handleSidebarDisplay={handleSidebarDisplay}
					/>
					<Container
						css={{
							padding: "0",
							minHeight: "100%",
							minWidth: "100%",
							overflowY: "scroll",
							overflowX: "hidden"
						}}
					>
						<NoteDisplay />
					</Container>
				</Container>
			</Container>
		</>
	);
};

export default NoteLayout;
