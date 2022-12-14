import { XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useNote } from "../../modules/AppContext";
import {
	Button,
	Modal,
	Input,
	Avatar,
	Container,
	Row,
	Col,
	Spacer,
	useTheme
} from "@nextui-org/react";
import { useSession } from "next-auth/react";


const ShareModal = ({ open, closeHandler }) => {
	const { checked, type } = useTheme();
	const [email, setEmail] = useState("");
	const [sharedUsers, setSharedUsers] = useState([]);
	const currentNote = useNote();
	const { data: session, status } = useSession();

	const addEmail = (event) => {
		setEmail(event.target.value);
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
			const updatedGroup = await res.json();
			console.log(updatedGroup, "sdfsdf");
			setSharedUsers(updatedGroup.user);
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
			const updatedGroup = await res.json();
			console.log(updatedGroup, "sdfsdf");
			setSharedUsers(updatedGroup.user);
		}
	};

	const getSharedUsers = async () => {
		let res = await fetch(`/api/collab`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id: currentNote.room?.id })
		});
		const updatedGroup = await res.json();
		console.log(updatedGroup, "sdfsdf");
		setSharedUsers(updatedGroup.user);
	};

	return (
		<Modal
			onOpen={() => (currentNote.room !== null ? getSharedUsers() : null)}
			blur
			scroll
			closeButton
			width="500px"
			open={open}
			onClose={closeHandler}
			css={{ margin: "10px" }}
		>
			<Modal.Header>Invite others to collaborate on this note</Modal.Header>
			<Modal.Body>
				<Container
					display="flex"
					alignItems="flex-end"
					wrap="nowrap"
					css={{ padding: "0", gap: "1rem" }}
				>
					<Input
						onChange={addEmail}
						clearable={true}
						type="email"
						label="Enter their email here"
						animated={false}
						css={{
							flex: "1",
							$$inputColor:
								type === "dark"
									? "var(--nextui-colors-background)"
									: "var(--nextui-colors-accents0)"
						}}
					/>
					<Button
						auto
						xs="true"
						onPress={() => shareHandler(email, "SHARE")}
						css={{ alignSelf: "flex-end" }}
					>
						Invite
					</Button>
				</Container>
				{sharedUsers.length > 0 && (
					<>
						<Spacer
							css={{
								minWidth: "100%",
								marginTop: "0 !important",
								marginLeft: "0 !important",
								borderBottom: "1px solid $border"
							}}
						/>
						<Container css={{ padding: "0" }}>
							People with access
							<Spacer />
							{sharedUsers.map((user, index) => (
								<Row
									align="center"
									key={index}
									css={{
										gap: "1rem",
										padding: "0.3rem 0"
									}}
								>
									<Avatar
										src={user.image}
										text={user.name?.charAt(0)}
										css={{
											background: "$accents6"
										}}
									/>
									<Col
										css={{
											maxWidth: "70%"
										}}
									>
										<Row>
											<span
												style={{
													overflow: "hidden",
													whiteSpace: "nowrap",
													textOverflow: "ellipsis"
												}}
											>
												{user.name}
											</span>
										</Row>
										<Row
											css={{
												color: "$accents6"
											}}
										>
											<span
												style={{
													overflow: "hidden",
													whiteSpace: "nowrap",
													textOverflow: "ellipsis"
												}}
											>
												{user.email}
											</span>
										</Row>
									</Col>
									{currentNote.room?.userId == user.id ? (
										"Owner"
									) : null}
									{currentNote.room?.userId == session?.user?.id && currentNote.room?.userId !== user.id ? (
										<Button
											onPress={() => shareHandler(user.email, "UNSHARE")}
											auto
											light
											ripple={false}
											icon={
												<XMarkIcon
													style={{
														height: "var(--icon-size-xs)"
													}}
												/>
											}
											css={{
												color: "$accents6",
												minWidth: "0",
												maxWidth: "var(--icon-size-xs)",
												height: "var(--icon-size-xs)",
												padding: "0.8rem",
												borderRadius: "var(--nextui-radii-sm)",
												marginLeft: "auto",
												"&:hover": {
													background: "$accents4",
													color: "$text"
												}
											}}
										/>
									): null}
								</Row>
							))}
						</Container>
					</>
				)}
			</Modal.Body>
			<Modal.Footer>
				{sharedUsers.length > 0 && (
					<Button auto onPress={closeHandler}>
						Done
					</Button>
				)}
			</Modal.Footer>
		</Modal>
	);
};

export default ShareModal;
