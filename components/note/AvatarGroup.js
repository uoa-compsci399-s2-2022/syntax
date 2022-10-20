import { Avatar } from "@nextui-org/react";

const AvatarGroup = ({ users }) => {
	const avatarLimit = 5;
	const userInitials = users.map((user) => user.name.match(/\b(\w)/g).join(""));

	return (
		<Avatar.Group
			count={users.length - avatarLimit > 0 && users.length - avatarLimit}
		>
			{users.slice(0, avatarLimit).map((user, index) => (
				<Avatar
					pointer
					stacked
					size="sm"
					key={index}
					text={userInitials[index]}
					css={{
						background: user.color
					}}
				/>
			))}
		</Avatar.Group>
	);
};

export default AvatarGroup;
