import Head from "next/head";
import darkTheme from "../styles/themes/darkTheme";
import lightTheme from "../styles/themes/lightTheme";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { NoteProvider } from "../modules/AppContext";
import { NextUIProvider } from "@nextui-org/react";
import { AppProps } from "next/app";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import "../styles/globals.css";
import { Session } from "next-auth";

export default function App({
	Component,
	pageProps: { session, ...pageProps }
}) {
	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta
					name="viewport"
					content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
				/>
				<meta
					name="description"
					content="Extended note-taking app for programming students"
				/>
				<meta name="keywords" content="Keywords" />
				<title>syntax</title>

				<link rel="manifest" href="/manifest.json" />
				<link
					href="/icons/icon-16x16.png"
					rel="icon"
					type="image/png"
					sizes="16x16"
				/>
				<link
					href="/icons/icon-32x32.png"
					rel="icon"
					type="image/png"
					sizes="32x32"
				/>
				<link
					href="/icons/icon-64x64.png"
					rel="icon"
					type="image/png"
					sizes="64x64"
				/>
				<link
					href="/icons/icon-128x128.png"
					rel="icon"
					type="image/png"
					sizes="128x128"
				/>
				<link
					href="/icons/icon-256x256.png"
					rel="icon"
					type="image/png"
					sizes="256x256"
				/>
				<link rel="apple-touch-icon" href="/apple-icon.png"></link>
			</Head>
			<SessionProvider session={session}>
				<NextThemesProvider
					defaultTheme="dark"
					attribute="class"
					value={{
						light: lightTheme.className,
						dark: darkTheme.className
					}}
				>
					<NextUIProvider>
						<NoteProvider>
							<Component {...pageProps} />
						</NoteProvider>
					</NextUIProvider>
				</NextThemesProvider>
			</SessionProvider>
		</>
	);
}
