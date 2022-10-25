import ExportModal from "@/components/modal/ExportModal";
import DeleteModal from "@/components/modal/DeleteModal";
import ShareModal from "@/components/modal/ShareModal";
import AvatarGroup from "@/components/note/AvatarGroup";
import { Dropdown, Button, Navbar, useTheme } from "@nextui-org/react";
import { useTheme as useNextTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { useReactToPrint } from "react-to-print";

import {
	EllipsisHorizontalIcon,
	TrashIcon,
	ShareIcon,
	DocumentArrowUpIcon,
	ChevronDoubleRightIcon,
	ChevronDoubleLeftIcon,
	SunIcon,
	MoonIcon,
	ArrowLeftOnRectangleIcon
} from "@heroicons/react/24/solid";
import { useNote, useDispatchNotes } from "../../modules/AppContext";

const NoteNavbar = ({
	sidebarDisplay,
	handleSidebarDisplay,
	collabUsers,
	pdfRef
}) => {
	const { setTheme } = useNextTheme();
	const { checked, type } = useTheme();
	const [shareModal, setShareModal] = useState(false);
	const [selectedKey, setSelectedKey] = useState();
	const [exportModal, setExportModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const router = useRouter();
	const currentNote = useNote();
	const setNotes = useDispatchNotes();

	const handlePdf = useReactToPrint({
		content: () => pdfRef?.current,
		onAfterPrint: () => setExportModal(false)
	});

	const deleteNoteHandler = async () => {
		try {
			let res = await fetch(`/api/note`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(currentNote.id)
			});
			const deletedNote = await res.json();
			setNotes({ note: deletedNote, type: "remove" });
			router.push(`/note`, "/");
			setDeleteModal(false);
			setSelectedKey();
		} catch (error) {
			console.log(error);
		}
	};

	const exportNoteHandler = async (fileType) => {
		try {
			if (fileType == "HTML") {
				let res = await fetch(`/api/note/${currentNote.id}/export/html`, {
					method: "GET"
				});
				setExportModal(false);
				let { text } = await res.json();
				const blob = new Blob([text], { type: "text/html" });
				const link = document.createElement("a");
				link.href = URL.createObjectURL(blob);
				link.setAttribute("download", `${currentNote.title}.html`);
				link.click();
			} else if (fileType == "Markdown") {
				const res = await fetch(`/api/note/${currentNote.id}/export/md`, {
					method: "GET"
				});
				setExportModal(false);
				let { text } = await res.json();
				const blob = new Blob([text], { type: "text/markdown" });
				const link = document.createElement("a");
				link.href = URL.createObjectURL(blob);
				link.setAttribute("download", `${currentNote.title}.md`);
				link.click();
			} else if (fileType == "PDF") {
				handlePdf();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const shareHandler = async (email, type) => {
		if (type == "SHARE") {
			console.log("SHARE");
			let res = await fetch(`/api/collab`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: email,
					roomId: currentNote?.room?.id || null,
					noteId: currentNote.id,
					YDOC: currentNote.YDOC
				})
			});
		}
		if (type == "UNSHARE") {
			console.log("UNSHARE");
			let res = await fetch(`/api/collab`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: email,
					id: currentNote?.room?.id || null
				})
			});
		}
	};

	const closeHandler = () => {
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
			case "changeTheme":
				type === "dark" ? setTheme("light") : setTheme("dark");
				setSelectedKey();
				break;
			case "signOut":
				signOut();
				setSelectedKey();
				break;
		}
	}, [selectedKey]);

	return (
		<Navbar
			disableShadow
			disableBlur
			className="no-print"
			variant="sticky"
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
					<AvatarGroup users={collabUsers} setShareModal={setShareModal} />
				</Navbar.Item>
				<Navbar.Item>
					<Dropdown placement="bottom-right">
						<Dropdown.Button
							light
							icon={<EllipsisHorizontalIcon style={{ height: "30px" }} />}
						/>
						<Dropdown.Menu onAction={setSelectedKey} aria-label="Note Options">
							<Dropdown.Section aria-label="Note Actions">
								<Dropdown.Item
									key="share"
									textValue="Share"
									icon={<ShareIcon style={{ height: "var(--icon-size-s)" }} />}
								>
									Share
								</Dropdown.Item>
								<Dropdown.Item
									key="export"
									textValue="Export"
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
									textValue="Delete"
									color="error"
									icon={<TrashIcon style={{ height: "var(--icon-size-s)" }} />}
								>
									Delete
								</Dropdown.Item>
							</Dropdown.Section>
							<Dropdown.Section aria-label="User Actions">
								<Dropdown.Item
									key="changeTheme"
									textValue="Change theme"
									icon={
										type === "dark" ? (
											<SunIcon style={{ height: "var(--icon-size-s)" }} />
										) : (
											<MoonIcon style={{ height: "var(--icon-size-s)" }} />
										)
									}
								>
									{type === "dark" ? "Light" : "Dark"} mode
								</Dropdown.Item>
								<Dropdown.Item
									key="signOut"
									textValue="Sign out"
									icon={
										<ArrowLeftOnRectangleIcon
											style={{ height: "var(--icon-size-s)" }}
										/>
									}
								>
									Sign out
								</Dropdown.Item>
							</Dropdown.Section>
						</Dropdown.Menu>
					</Dropdown>
				</Navbar.Item>
				<ExportModal
					open={exportModal}
					closeHandler={closeHandler}
					exportHandler={exportNoteHandler}
				/>
				<ShareModal
					open={shareModal}
					closeHandler={closeHandler}
					shareHandler={shareHandler}
				/>
				<DeleteModal
					open={deleteModal}
					closeHandler={closeHandler}
					deleteHandler={deleteNoteHandler}
				/>
			</Navbar.Content>
		</Navbar>
	);
};

export default NoteNavbar;
