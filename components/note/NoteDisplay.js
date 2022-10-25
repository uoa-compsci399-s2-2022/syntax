import { Container, Spacer, Dropdown } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { debounce } from "lodash";
import { useRef } from "react";
import { useRouter } from "next/router";
import {
	useNote,
	useNotes,
	useDispatchNotes,
	useDispatchNote
} from "../../modules/AppContext";

const Tiptap = dynamic(() => import("@/components/editor/Tiptap"), {
	ssr: false
});

const NoteDisplay = ({ setCollabUsers, pdfRef }) => {
	const currentNote = useNote();
	const notes = useNotes();
	const setNotes = useDispatchNotes();
	const router = useRouter();
	const setCurrentNote = useDispatchNote();
	const debounceSave = useRef(
		debounce(async (criteria) => {
			saveContent(criteria);
		}, 500)
	).current;

	const saveContent = async (content) => {
		console.log("save title debounce", content, currentNote);
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
		updatedNote.currentGroupId = content.currentGroupId;
		setNotes({ note: updatedNote, type: "edit" });
		setCurrentNote(updatedNote);
		router.push(`/note/${updatedNote.id}`, undefined, {
			shallow: true
		});
	};

	if (!currentNote && notes) return null;
	return (
		<>
			<Container
				ref={pdfRef}
				css={{
					margin: "0",
					padding: "0 10% 10% 10%",
					maxWidth: "100vw",
					background: "$background"
				}}
			>
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
						lineHeight: "var(--nextui-lineHeights-sm)",
						fontWeight: "var(--nextui-fontWeights-bold)",
						background: "none",
						border: "none",
						marginBottom: "1rem"
					}}
				>
					{currentNote.title}
				</div>
				<table
					className="note-metadata-table no-print"
					style={{ textAlign: "left" }}
				>
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
												lineHeight: "2",
												borderRadius: "0",
												zIndex: "0",
												overflow: "hidden"
											}}
										>
											<span
												style={{
													minWidth: "0",
													maxWidth: "200px",
													overflow: "hidden",
													whiteSpace: "nowrap",
													textOverflow: "ellipsis"
												}}
											>
												{currentNote.group.name}
											</span>
										</Dropdown.Button>
										<Dropdown.Menu
											disallowEmptySelection
											aria-label="Group Selection"
											selectionMode="single"
											selectedKeys={currentNote.group.name}
											onAction={(e) =>
												debounceSave({
													id: currentNote.id,
													groupId: e,
													currentGroupId: currentNote.groupId
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
				<Spacer
					css={{
						marginLeft: "0",
						width: "100%",
						borderBottom: "1px solid $border",
						"@xs": { border: "none" }
					}}
				/>
				<Tiptap setCollabUsers={setCollabUsers} />
			</Container>
			<Spacer y={4} />
		</>
	);
};

export default NoteDisplay;
