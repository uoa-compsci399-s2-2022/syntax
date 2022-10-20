import ExportModal from "@/components/modal/ExportModal";
import DeleteModal from "@/components/modal/DeleteModal";
import SettingsModal from "@/components/modal/SettingsModal";
import ShareModal from "@/components/modal/ShareModal";
import AvatarGroup from "@/components/note/AvatarGroup";
import { Avatar, Dropdown, Button, Navbar } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
// import { Document, Page, pdf} from '@react-pdf/renderer'
// import Html from 'react-pdf-html'
import {
	EllipsisHorizontalIcon,
	TrashIcon,
	ShareIcon,
	LockClosedIcon,
	DocumentArrowUpIcon,
	ChevronDoubleRightIcon,
	ChevronDoubleLeftIcon
} from "@heroicons/react/24/solid";

import {
	useNote,
	useDispatchNote,
	useNotes,
	useDispatchNotes
} from "../../modules/AppContext";

// const PDFElement = (html) => {
//     return (
//         <Document>
//             <Page size="A4">
//                 <Html>{html}</Html>
//             </Page>
//         </Document>
//     )
// }

const NoteNavbar = ({ sidebarDisplay, handleSidebarDisplay }) => {
	const router = useRouter();
	const [shareModal, setShareModal] = useState(false);
	const [selectedKey, setSelectedKey] = useState();
	const [exportModal, setExportModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [settingsModal, setSettingsModal] = useState(false);
	const currentNote = useNote();
	const setNotes = useDispatchNotes();

	const placeholderUserData = [
		{
			name: "Johnny Appleseed",
			color: "grey",
			email: "j.appleseed@gmail.com",
			owner: true
		},
		{ name: "Jane Doe", color: "grey", email: "jane.d@hotmail.com" },
		{ name: "Test User 1", color: "grey", email: "testtest123@gmail.com" },
		{ name: "Test User 2", color: "grey", email: "tu2@hotmail.com" },
		{ name: "Test User 3", color: "grey", email: "tu3@hotmail.com" },
		{ name: "Test User 4", color: "grey", email: "tu4@hotmail.com" },
		{ name: "Test User 5", color: "grey", email: "tu5@hotmail.com" },
		{ name: "Test User 6", color: "grey", email: "tu6@hotmail.com" },
		{
			name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec metus enim, sodales vel nisl vel, lobortis suscipit enim. Praesent scelerisque fringilla urna, at semper mi aliquam sed. Ut nec placerat nulla. Sed non odio vel dolor sodales maximus. Duis ut leo velit. Duis egestas nisi sit amet diam egestas, quis aliquam odio fermentum. Morbi eu ultrices felis.",
			color: "grey",
			email:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec metus enim, sodales vel nisl vel, lobortis suscipit enim. Praesent scelerisque fringilla urna, at semper mi aliquam sed. Ut nec placerat nulla. Sed non odio vel dolor sodales maximus. Duis ut leo velit. Duis egestas nisi sit amet diam egestas, quis aliquam odio fermentum. Morbi eu ultrices felis."
		}
	];

	const deleteNoteHandler = async () => {
		try {
			console.log(currentNote);
			let res = await fetch(`/api/note`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(currentNote.id)
			});
			const deletedNote = await res.json();
			setNotes({ note: deletedNote, type: "remove" });
			setDeleteModal(false);
			router.push(`/note/`, undefined, { shallow: true });
		} catch (error) {
			console.log(error);
		}
	};

	// const exportNoteHandler = async (fileType) => {
	// 	try{
	// 		console.log(fileType)
	// 		if (fileType =="HTML"){
	// 			let res = await fetch(`/api/note/${currentNote.id}/export/html`, {
	// 				method: "GET",
	// 			});
	// 			let { text } = await res.json()
	// 			console.log(text)
	// 			const blob = new Blob([text], {type: "text/html"})
	// 			const link = document.createElement('a');
	// 			link.href = URL.createObjectURL(blob);
	// 			link.setAttribute('download', `${currentNote.title}.html`);
	// 			link.click();
	// 		} else if (fileType =="Markdown") {
	// 			const res = await fetch(`/api/note/${currentNote.id}/export/md`, {
	// 				method: "GET",
	// 			});
	// 			let { text } = await res.json()
	// 			const blob = new Blob([text], {type: "text/markdown"})
	// 			const link = document.createElement('a');
	// 			link.href = URL.createObjectURL(blob);
	// 			link.setAttribute('download', `${currentNote.title}.md`);
	// 			link.click();
	// 		}
	// 		else if (fileType == "PDF"){
	// 			const res = await fetch(`/api/note/${currentNote.id}/export/pdf`, {
	// 				method: "GET",
	// 			});
	// 			let { text } = await res.json();
	// 			const content = PDFElement(text)
	// 			const blobPromise = pdf(content).toBlob().then((blob)=> {
	// 				const link = document.createElement('a');
	// 				link.href = URL.createObjectURL(blob);
	// 				link.setAttribute('download', `${currentNote.title}.pdf`);
	// 				link.click();
	// 			});

	// 		}
	// 	} catch (error) {
	// 		console.log(error)
	// 	}
	// }

	const shareHandler = async () => {
		console.log("share");
		router.push({
			pathname: `/room/${currentNote.id}`,
			query: { sharing: true },
			options: { shallow: true }
		});
		setShareModal(false);
	};

	const closeHandler = () => {
		setSettingsModal(false);
		setShareModal(false);
		setExportModal(false);
		setDeleteModal(false);
		setSelectedKey();
	};

	useEffect(() => {
		switch (selectedKey) {
			case "share":
				setShareModal(true);
				break;
			case "export":
				setExportModal(true);
				break;
			case "delete":
				setDeleteModal(true);
				break;
		}
	}, [selectedKey]);

	return (
		<Navbar
			variant="sticky"
			disableShadow
			disableBlur
			css={{ zIndex: 2 }}
			containerCss={{
				minWidth: "100%"
			}}
		>
			<Navbar.Content>
				<Navbar.Item css={{ display: "none", "@xs": { display: "flex" } }}>
					<Button
						auto
						light
						animated={false}
						onPress={handleSidebarDisplay}
						icon={
							sidebarDisplay ? (
								<ChevronDoubleRightIcon
									style={{ height: "var(--icon-size)" }}
								/>
							) : (
								<ChevronDoubleLeftIcon style={{ height: "var(--icon-size)" }} />
							)
						}
					/>
				</Navbar.Item>
				<Navbar.Item css={{ display: "flex", "@xs": { display: "none" } }}>
					<Button
						auto
						light
						animated={false}
						onPress={handleSidebarDisplay}
						icon={
							<ChevronDoubleLeftIcon style={{ height: "var(--icon-size)" }} />
						}
					>
						All Notes
					</Button>
				</Navbar.Item>
			</Navbar.Content>
			<Navbar.Content gap={5}>
				<Navbar.Item>
					<AvatarGroup users={placeholderUserData} />
				</Navbar.Item>
				<Navbar.Item>
					<Button
						auto
						light
						animated={false}
						onPress={setSettingsModal}
						icon={
							<Avatar
								src="https://cdn3.emoji.gg/emojis/3568-catkiss.gif"
								css={{ cursor: "pointer" }}
							/>
						}
					/>
				</Navbar.Item>
				<Navbar.Item>
					<Dropdown placement="bottom-right">
						<Dropdown.Button
							light
							icon={<EllipsisHorizontalIcon style={{ height: "30px" }} />}
						/>
						<Dropdown.Menu
							disabledKeys={["lock"]}
							onAction={setSelectedKey}
							aria-label="Note Options"
						>
							<Dropdown.Item
								key="share"
								icon={<ShareIcon style={{ height: "var(--icon-size-s)" }} />}
							>
								Share
							</Dropdown.Item>
							<Dropdown.Item
								key="lock"
								icon={
									<LockClosedIcon style={{ height: "var(--icon-size-s)" }} />
								}
							>
								Lock
							</Dropdown.Item>
							<Dropdown.Item
								key="export"
								icon={
									<DocumentArrowUpIcon
										style={{ height: "var(--icon-size-s)" }}
									/>
								}
							>
								Export
							</Dropdown.Item>
							<Dropdown.Item
								key="delete"
								color="error"
								icon={<TrashIcon style={{ height: "var(--icon-size-s)" }} />}
							>
								Delete
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</Navbar.Item>
				{/* <ExportModal open={exportModal} oncloseHandler={closeHandler} closeHandler={exportNoteHandler} /> */}
				<ShareModal
					open={shareModal}
					closeHandler={closeHandler}
					shareHandler={shareHandler}
					users={placeholderUserData}
				/>
				<DeleteModal
					open={deleteModal}
					onclosehandler={closeHandler}
					closeHandler={deleteNoteHandler}
				/>
				<SettingsModal open={settingsModal} closeHandler={closeHandler} />
			</Navbar.Content>
		</Navbar>
	);
};

export default NoteNavbar;
