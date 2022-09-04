import NoteList from "./NoteList";
import { Container, Input, Button, Spacer } from "@nextui-org/react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

const NoteSidebar = ({ notes }) => {
	const router = useRouter();
	return (
		<Container
			display="flex"
			wrap="nowrap"
			direction="column"
			css={{
				"max-width": "25%",
				"min-width": "min-content",
				padding: "0",
				margin: "0",
				background: "$accents2",
				"max-height": "100vh",
				float: "left",
				"overflow-y": "auto",
			}}
		>
			<Container css={{ padding: "30px" }}>
				<Input
					clearable
					aria-label="Notes search bar"
					placeholder="Search notes"
					type="search"
					contentLeft={<MagnifyingGlassIcon style={{ height: "24px" }} />}
					css={{ width: "100%" }}
				/>
				<NoteList retrieved_notes={notes} showEditor={undefined} key={notes} />
				<Button
					bordered
					color="primary"
					icon={<PlusIcon style={{ height: "24px" }} />}
					css={{ width: "100%" }}
					onPress={() => { router.push(`/note`, undefined, {shallow: true}) }}
				>
					Add new note
				</Button>
			</Container>
			<Spacer />
		</Container>
	);
};

export default NoteSidebar;
