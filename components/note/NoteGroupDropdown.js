import { Dropdown } from "@nextui-org/react";
import {
	useNotes
} from "../../modules/AppContext";
export const NoteGroupDropdown = () => {
	const notescc = useNotes();
	return (
		<>
			{notes.groups.map((group, index) => (
				<Dropdown.Item
					key={group.id}
					value={group.id}
					css={{ overflow: "hidden", whiteSpace: "nowrap" }}
				>
					{group.name}
				</Dropdown.Item>
			))}</>
	);
}