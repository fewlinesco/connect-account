import type { AppProps } from "next/app";
import type {
  AppType,
  DocumentInitialProps,
} from "next/dist/next-server/lib/utils";
import Document, { Html, Main, Head, NextScript } from "next/document";
import React from "react";
import { ServerStyleSheet } from "styled-components";

import { generateCSP } from "@src/utils/generate-csp";

export default class MyDocument extends Document {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  static async getInitialProps(ctx: any): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet();

    const originalRenderPage = ctx.renderPage;

    ctx.res.setHeader("Content-Security-Policy", generateCSP());

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: AppType) => (props: AppProps) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" />
          <meta name="theme-color" content="#ffffff" />
          <meta
            name="description"
            content="Connect Account let you handle your Connect account and profile data."
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
