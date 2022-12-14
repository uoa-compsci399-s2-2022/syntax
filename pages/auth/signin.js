import BlobBackground from "@/components/home/BlobBackground";
import {
	Button,
	Text,
	Container,
	Card,
	Navbar,
	Link,
	Image,
	useTheme
} from "@nextui-org/react";
import { signIn, getCsrfToken, getProviders } from "next-auth/react";
import Head from "next/head";

export async function getServerSideProps(context) {
	const providers = await getProviders();
	const csrfToken = await getCsrfToken(context);
	return {
		props: {
			providers,
			csrfToken
		}
	};
}

const SignIn = ({ csrfToken, providers }) => {
	const { isDark, type } = useTheme();

	return (
		<>
			<Head>
				<meta name="theme-color" content={isDark ? "#121212" : "white"} />
			</Head>
			<BlobBackground />
			<Container
				display="flex"
				justify="center"
				alignItems="flex-start"
				css={{
					padding: "0",
					width: "100vw",
					height: "100vh"
				}}
			>
				<Navbar
					disableBlur
					disableShadow
					maxWidth="fluid"
					css={{
						background: "transparent"
					}}
					containerCss={{ background: "transparent !important" }}
				>
					<Navbar.Brand>
						<Link href="/">
							<Image
								width={40}
								draggable="false"
								src="/icons/icon-64x64.png"
								alt="syntax logo"
							/>
						</Link>
					</Navbar.Brand>
				</Navbar>
				<Card
					css={{ maxWidth: "400px", margin: "10px", background: "$background" }}
				>
					<Card.Header
						css={{
							justifyContent: "center",
							paddingTop: "20px",
							paddingBottom: "0"
						}}
					>
						<Text h1>Sign In</Text>
					</Card.Header>
					<Card.Body css={{ alignItems: "center", paddingBottom: "12px" }}>
						{providers &&
							Object.values(providers).map((provider) => (
								<Button
									key={provider.name}
									onPress={() => signIn(provider.id, { callbackUrl: "/note" })}
									css={{ width: "70%" }}
								>
									Sign in with {provider.name}
								</Button>
							))}
					</Card.Body>
					<Card.Footer css={{ padding: "20px" }} />
				</Card>
			</Container>
		</>
	);
};

export default SignIn;
