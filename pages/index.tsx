import { useRouter } from "next/router";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { Button, Text, Grid, Spacer, Switch, useTheme, Image } from '@nextui-org/react';
import Head from "next/head";

import { useTheme as useNextTheme } from 'next-themes'
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { useMediaQuery } from './useMediaQuery.js';

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

  const isMd = useMediaQuery(960);

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
        
        <link rel="icon" href="/favicon.ico"/>
        <meta name="theme-color" content="#317EFB" />

      </Head>
        <Grid.Container gap={2} justify='flex-start' >
          <Grid xs={isMd ? 2.5 : 1}>
            <Image
            width={50}
            height={50}
            src='/favicon.ico'
            alt='syntax logo'
            objectFit="initial"/>
          </Grid>
          <Grid xs={isMd ? 4.2 : 9.7}></Grid>
          <Grid xs={1}>
          <Switch 
            checked={isDark}
            iconOn={<MoonIcon />}
            iconOff={<SunIcon />}
            onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
          />
          <Spacer x={ isMd ? 0.5 : 1}/>
          <Button bordered ghost onClick={() => signIn()} responsive auto>Sign in</Button>
          </Grid>
        </Grid.Container>

			<Spacer y={1}/>
			
			<Text size={60} weight={'bold'} align="center">syntax</Text>
			<Text h2 align="center" weight="normal" size={ isMd ? 30 :35} >Code. Learn. Collaborate.</Text>
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
