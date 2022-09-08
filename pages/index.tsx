import { useRouter } from "next/router";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { Button, Text, Container, Row, Col, Spacer, Switch, useTheme } from '@nextui-org/react';
import Head from "next/head";

import darkTheme from "../styles/themes/darkTheme";
import lightTheme from "../styles/themes/lightTheme";
import { useTheme as useNextTheme } from 'next-themes'
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

const getAllNotesByUserID = require("../prisma/Note").getAllNotesByUserID;

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });

  if (!session) {
    res.statusCode = 403;
    return { props: { notes: [] } };
  }

  const notes = await getAllNotesByUserID(session?.user?.id);

  return {
    props: { notes },
  };
};

export default function Component() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const { setTheme } = useNextTheme();
  const { isDark, type } = useTheme();

  if (!session) {
    return (
      <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="Description" />
        <meta name="keywords" content="Keywords" />
        <title>syntax</title>

        <link rel="manifest" href="/manifest.json" />
        <link
          href="/icons/favicon-16x16.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/icons/favicon-32x32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/apple-icon.png"></link>
        <meta name="theme-color" content="#317EFB" />

      </Head>
        <Container gap={0} fluid responsive auto css={{m: 10, d:'flex', flexWrap: 'nowrap'}}>
				<Row gap={1}>
					<Col>
						<Text h6 size={15} color="black" css={{ m: 0, float:'left' }}>
							insert logo here
						</Text>
					</Col>
					<Col>
					<Button bordered ghost onClick={() => signIn()} css={{float: 'right'}} responsive auto>Sign in</Button>
          
          <Switch
            checked={isDark}
            iconOn={<MoonIcon />}
            iconOff={<SunIcon />}
            onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
            css={{float: 'right'}}
          />
    
					
					</Col>
				</Row>
				<Spacer y={1} />
			</Container>

			<Spacer y={1}/>
			
			<Text h1 size={60} align="center">syntax</Text>
			<Text h2 align="center" weight="normal">Code. Learn. Collaborate.</Text>
      </>
    );
  }

  return (
    <>
      Signed in as {session.user.email} <br />
      <Button bordered onClick={() => signOut()}>Sign out</Button>
      <Button bordered onClick={() => router.push("/note")}>
          <span>Go to Notes</span>
        </Button>
    </>
  );
}
