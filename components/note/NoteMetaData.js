
import { Dropdown } from "@nextui-org/react";
import { debounce } from "lodash";
import { useRef } from "react";
import { useNote, useNotes, useDispatchNotes } from "../../modules/AppContext";

export const NoteMetaData = () => {
	const notes = useNotes();
	console.log(notes);
	const currentNote = useNote();
	const setNotes = useDispatchNotes();
	const debounceSave = useRef(
		debounce(async (criteria) => {
			saveContent(criteria);
		}, 500)
	).current;

	const saveContent = async (content) => {
		console.log("editor debounce", content);
		let note = {
			id: content.id,
			title: content.title,
			body: content.body,
			groupId: content.groupId
		};
		let res = await fetch("/api/note", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(note)
		});

		const updatedNote = await res.json();
		setNotes({ note: updatedNote, type: "edit" });
	};
	return (
		<>
			<div
				contentEditable="true"
				suppressContentEditableWarning="true"
				onInput={(e) => {
					debounceSave({
						id: currentNote.id,
						title: e.currentTarget.textContent,
						body: currentNote.body
					});
				}}
				style={{
					width: "100%",
					fontSize: "var(--nextui-fontSizes-5xl)",
					letterSpacing: "var(--nextui-letterSpacings-tighter)",
					lineHeight: "var(--nextui-lineHeights-md)",
					fontWeight: "var(--nextui-fontWeights-bold)",
					background: "none",
					border: "none"
				}}
			>
				{currentNote.title}
			</div>
			<table className="note-metadata-table" style={{ textAlign: "left" }}>
				<tbody>
					<tr>
						<th>Created by</th>
						<td>{currentNote.user.name}</td>
					</tr>
					<tr>
						<th>Last modified</th>
						<td>
							{new Date(currentNote.updatedAt).toLocaleString("en-us", {
								year: "numeric",
								month: "short",
								day: "numeric",
								hour: "numeric",
								minute: "numeric"
							})}
						</td>
					</tr>
					{currentNote.group ? (
						<tr>
							<th>Group</th>
							<td>
								<Dropdown>
									<Dropdown.Button
										light
										ripple={false}
										css={{
											padding: "0",
											height: "min-content",
											lineHeight: "0",
											borderRadius: "0",
											zIndex: "0"
										}}
									>
										{currentNote.group.name}
									</Dropdown.Button>
									<Dropdown.Menu
										disallowEmptySelection
										aria-label="Group Selection"
										selectionMode="single"
										selectedKeys={currentNote.group.name}
										onAction={(e) =>
											debounceSave({
												id: currentNote.id,
												groupId: e.target.value
											})
										}
									>
										{notes.groups.map((group, index) => (
											<Dropdown.Item
												key={group.id}
												value={group.id}
												css={{ overflow: "hidden", whiteSpace: "nowrap" }}
											>
												{group.name}
											</Dropdown.Item>
										))}
									</Dropdown.Menu>
								</Dropdown>
							</td>
						</tr>
					) : null}
				</tbody>
			</table>
		</>
	)
}