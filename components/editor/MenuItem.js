import { Tooltip, Button } from "@nextui-org/react";
import { useRef } from "react";

const MenuItem = ({
	icon,
	label,
	action,
	isActive = null,
	breakpoint,
	handleFileChange
}) => {
	const fileRef = useRef();
	const breakpointStyle = {};
	if (breakpoint) {
		if (breakpoint === "sm") {
			breakpointStyle = { display: "none", "@sm": { display: "flex" } };
		} else if (breakpoint === "md") {
			breakpointStyle = { display: "none", "@md": { display: "flex" } };
		}
	}

	return (
		<Tooltip content={label}>
			{label === "Image" ? (
				<Button
					auto
					className={`menu-item${isActive && isActive() ? " is-active" : ""}`}
					onPress={() => fileRef.current.click()}
					css={{
						...breakpointStyle,
						backgroundColor: "transparent",
						padding: "0",
						margin: "0 0.8rem 0 0.5rem"
					}}
				>
					<>
						{icon}
						<input
							id="upload"
							name="upload"
							type="file"
							accept="image/*"
							ref={fileRef}
							hidden
							onClick={(e) => (e.target.value = "")}
							onChange={handleFileChange}
						/>
					</>
				</Button>
			) : (
				<Button
					auto
					className={`menu-item${isActive && isActive() ? " is-active" : ""}`}
					onPress={action}
					icon={icon}
					css={{
						...breakpointStyle,
						backgroundColor: "transparent",
						marginRight: "0.3rem"
					}}
				/>
			)}
		</Tooltip>
	);
};

export default MenuItem;
