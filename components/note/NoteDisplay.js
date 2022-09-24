import Head from "next/head";
import { Container, Text, Spacer, Grid, Input } from "@nextui-org/react";
import ImageEditor from "../editor/ImageEditor";
import Tiptap from "@/components/editor/Tiptap";
import { debounce } from "lodash";
import { useRef } from "react";
import {
	useNote,
	useDispatchNote,
	useNotes,
	useDispatchNotes
} from "../../modules/AppContext";

const NoteDisplay = ({ note, handleSidebarDisplay }) => {
	const notesc = useNotes();
	const setNotes = useDispatchNotes();

	const currentNote = useNote();
	const setCurrentNote = useDispatchNote();
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

	if (note == null) {
		return (
			<>
				<Head>
					<title>Login to view note</title>
					<meta name="description" content="Login to view this note" />
					<link rel="icon" href="/favicon.ico" />
				</Head>

				<h1>Oops... You have to login to view this note</h1>
			</>
		);
	} else {
		return (
			<>
				<Head>
					<title>{currentNote.title}</title>
					{/*<meta name="description" content={`By ${note.user.name}`} />*/}
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<Container
					css={{
						margin: "0",
						padding: "0 10%",
						maxWidth: "100vw"
					}}
				>
					{/* <Text h1 css={{ overflowWrap: "break-word" }}>
						{currentNote.title}
					</Text> */}
					<Input
						underlined
						aria-label="Note Title"
						animated={false}
						initialValue={currentNote.title}
						onChange={(e) => {
							debounceSave({
								id: currentNote.id,
								title: e.target.value,
								body: currentNote.body
							});
						}}
					></Input>
					<table className="note-metadata-table" style={{ textAlign: "left" }}>
						<tbody>
							<tr>
								<th>Created by</th>
								<td>{note.user.name}</td>
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
									<th>Folder</th>
									<td>
										{currentNote.group.name}
										<select
											contentEditable={false}
											defaultValue={currentNote.group.name}
											onChange={(e) =>
												debounceSave({
													id: currentNote.id,
													groupId: e.target.value
												})
											}
										>
											{notesc.groups.map((group, index) => (
												<option key={group.id} value={group.id}>
													{group.name}
												</option>
											))}
										</select>
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
					<Tiptap noteContent={currentNote.body} />
				</Container>
				<Spacer />
			</>
		);
	}
};

export default NoteDisplay;
