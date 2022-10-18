import BlobBackground from "@/components/BlobBackground";
import { Button, Text, Container, Card } from "@nextui-org/react";
import { signIn, getCsrfToken, getProviders } from "next-auth/react";

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

const Signin = ({ csrfToken, providers }) => {
	return (
		<>
			<BlobBackground />
			<Container
				display="flex"
				justify="center"
				alignItems="center"
				css={{ padding: "0", width: "100vw", height: "100vh" }}
			>
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

export default Signin;
