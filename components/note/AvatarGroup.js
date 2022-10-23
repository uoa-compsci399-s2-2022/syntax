import { Avatar, Tooltip } from "@nextui-org/react";

const AvatarGroup = ({ users, setShareModal }) => {
	const avatarLimit = 5;
	const avatarSize = "30px";

	return (
		<Avatar.Group
			count={users.length - avatarLimit > 0 && users.length - avatarLimit}
		>
			{users.slice(0, avatarLimit).map((user, index) => (
				<Tooltip placement="bottom" content={user.name} key={index}>
				<Avatar
					pointer
					key={index}
					src={user.image}
					text={user.name?.charAt(0)}
					onClick={() => setShareModal(true)}
					css={{
						background: "$accents6",
						minWidth: avatarSize,
						minHeight: avatarSize,
						width: avatarSize,
						height: avatarSize
					}}
				/>
				</Tooltip>
			))}
		</Avatar.Group>
	);
};

export default AvatarGroup;
