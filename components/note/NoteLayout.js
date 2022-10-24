import NoteDisplay from ".//NoteDisplay";
import NoteSidebar from "./NoteSidebar";
import NoteNavbar from "./NoteNavbar";
import { Container } from "@nextui-org/react";
import { useState } from "react";
import {
	useNote,
	useDispatchNote,
	useNotes,
	useDispatchNotes
} from "@/modules/AppContext";

const NoteLayout = ({ allNotes, currentNote }) => {
	const [sidebarDisplay, setSidebarDisplay] = useState(false);

	const handleSidebarDisplay = () => {
		setSidebarDisplay((current) => !current);
	};

	return (
		<Container
			fluid
			display="flex"
			wrap="nowrap"
			css={{
				minWidth: "100vw",
				minHeight: "100vh",
				padding: "0",
				margin: "0",
				background: "$background"
			}}
		>
			<NoteSidebar
				notes={allNotes}
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
					<NoteDisplay note={currentNote} key={currentNote} />
				</Container>
			</Container>
		</Container>
	);
};

export default NoteLayout;
