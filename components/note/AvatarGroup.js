import { Avatar } from "@nextui-org/react";

const AvatarGroup = () => {
	const avatarLimit = 5;
	const users = [
		{
			name: "Johnny Appleseed",
			color: "grey",
			email: "j.appleseed@gmail.com"
		},
		{ name: "Jane Doe", color: "grey", email: "jane.d@hotmail.com" },
		{ name: "Test User", color: "grey", email: "testtest123@gmail.com" },
		{ name: "1", color: "grey", email: "1@hotmail.com" },
		{ name: "2", color: "grey", email: "2@hotmail.com" },
		{ name: "3", color: "grey", email: "3@hotmail.com" },
		{ name: "4", color: "grey", email: "4@hotmail.com" }
	];

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
