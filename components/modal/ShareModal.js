import {
	Button,
	Modal,
	Input,
	Avatar,
	Container,
	Row,
	Col,
	Spacer,
	Tooltip,
	useTheme
} from "@nextui-org/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

const ShareModal = ({ open, closeHandler, shareHandler, users }) => {
	const { checked, type } = useTheme();
	const share_link = "Insert Link Here";
	const userInitials = users.map((user) => user.name.match(/\b(\w)/g).join(""));

	return (
		<Modal
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
						clearable
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
						xs
						onPress={closeHandler}
						css={{ alignSelf: "flex-end" }}
					>
						Invite
					</Button>
				</Container>
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
					{users.map((user, index) => (
						<Row
							align="center"
							key={index}
							css={{
								gap: "1rem",
								padding: "0.3rem 0"
							}}
						>
							<Avatar
								text={userInitials[index]}
								css={{
									background: user.color
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
							{user.owner ? (
								"Owner"
							) : (
								<Button
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
							)}
						</Row>
					))}
				</Container>
			</Modal.Body>
			<Modal.Footer justify="space-between">
				<Button
					auto
					bordered
					flat
					onPress={() => {
						navigator.clipboard.writeText(share_link);
					}}
				>
					Copy Link
				</Button>
				<Button auto onPress={closeHandler}>
					Done
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ShareModal;
