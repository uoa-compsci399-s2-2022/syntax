import { SessionProvider } from "next-auth/react";
import { NoteProvider } from "../modules/AppContext";
import { NextUIProvider } from "@nextui-org/react";
import Head from "next/head";
import { AppProps } from "next/app";
import { createTheme } from "@nextui-org/react";

const lightTheme = createTheme({
  type: "light",
  theme: {
    colors: {
      cyan: "#8BE9FD",
      green: "#50FA7B",
      orange: "#FFB86C",
      pink: "#FF79C6",
      purple: "#BD93F9",
      red: "#FF5555",
      yellow: "#F1FA8C"
    }
  }
})

const darkTheme = createTheme({
  type: "dark",
  theme: {
    colors: {
      background: "#121212",
      bg800: "#1E1E1E",
      bg700: "#222222",
      bg600: "#242424",
      bg500: "#272727",
      bg400: "#2C2C2C",
      bg300: "#2E2E2E",
      bg200: "#333333",
      bg100: "#353535",
      bg50: "#383838",
      cyan: "#8BE9FD",
      green: "#50FA7B",
      orange: "#FFB86C",
      pink: "#FF79C6",
      purple: "#BD93F9",
      red: "#FF5555",
      yellow: "#F1FA8C"
    }
  }
});

export default function App({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) {
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
        <title>co:note</title>

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
      <SessionProvider session={session}>
        <NextUIProvider theme={darkTheme}>
          <NoteProvider>
            <Component {...pageProps}/>
          </NoteProvider>
        </NextUIProvider>
      </SessionProvider>
    </>
  );
}
