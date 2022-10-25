import { useTheme, styled } from "@nextui-org/react";


const BlobBackground = () => {
	const { isDark, type } = useTheme();

	const Blob1 = styled("div", {
		width: "45%",
		height: "45%",
		borderRadius: "40%",
		position: "absolute"
	});

	const Blob2 = styled("div", {
		width: "35%",
		height: "35%",
		borderRadius: "35%",
		position: "absolute"
	});

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				overflow: "hidden",
				overflowX: "hidden"
			}}
		>
			<div
				style={{
					display: "flex",
					position: "fixed",
					width: "100%",
					height: "100%",
					zIndex: "-1",
					overflow: "clip",
					background: type === "dark" ? "#161b22" : "white"
				}}
			></div>
			<Blob1
				css={{
					background:
						"linear-gradient(180deg, rgba(97, 175, 239, 0.5) 0%, rgba(59, 132, 192, 0.5) 90.62%)",
					top: "-12%",
					right: "-13%",
					filter: "blur(160px)",

					// "-webkit-animation": "spin 20s linear infinite",
					// "-moz-animation": "spin 20s linear infinite",
					// animation: "spin 20s linear infinite"
				}}
			/>
			<Blob1
				css={{
					background:
						"linear-gradient(rgba(198, 120, 221, 0.5) 0%, rgba(122, 50, 143, 0.5) 100%)",
					float: "left",
					bottom: "0",
					bottom: "0%",
					left: "-27%",
					filter: "blur(160px)",
					// "-webkit-animation": "spinleft 23s linear infinite",
					// "-moz-animation": "spinleft 23s linear infinite",
					// animation: "spinleft 23s  linear infinite"
				}}
			/>
			{/* <Blob2
				css={{
					background:
						"linear-gradient(180deg, rgba(94, 197, 129, 0.5) 0%, rgba(109, 189, 126, 0.5) 90.62%)",
					top: "50%",
					right: "-15%",
					filter: "blur(160px)",
					"-webkit-animation": "spinleft 25s linear infinite",
					"-moz-animation": "spinleft 25s linear infinite",
					animation: "spinleft 25s  linear infinite"
				}}
			/> */}
		</div>
	);
};

export default BlobBackground;
