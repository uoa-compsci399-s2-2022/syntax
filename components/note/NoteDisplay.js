import Head from "next/head";
import { Container, Spacer, Dropdown } from "@nextui-org/react";
import Tiptap from "@/components/editor/Tiptap";
import { debounce } from "lodash";
import { useRef } from "react";
import { useRouter } from "next/router";
import { useNote, useNotes, useDispatchNotes } from "../../modules/AppContext";

const NoteDisplay = () => {
	const currentNote = useNote();
	const notes = useNotes();
	const setNotes = useDispatchNotes();
	const router = useRouter();
	const debounceSave = useRef(
		debounce(async (criteria) => {
			saveContent(criteria);
		}, 500)
	).current;

	const saveContent = async (content) => {
		console.log("save title debounce", content);
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
		router.push(`/note/${updatedNote.id}`, undefined, {
			shallow: true
		});
	};

	if (!currentNote && notes) return null;
	return (
		<>
			<Container
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
				<Spacer
					css={{
						marginLeft: "0",
						width: "100%",
						borderBottom: "1px solid $border",
						"@xs": { border: "none" }
					}}
				/>
				<Tiptap />
			</Container>
			<Spacer y={4} />
		</>
	);
};

export default NoteDisplay;
