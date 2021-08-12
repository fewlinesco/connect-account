import type { AppProps } from "next/app";
import type {
  AppType,
  DocumentInitialProps,
} from "next/dist/next-server/lib/utils";
import Document, { Html, Main, Head, NextScript } from "next/document";
import React from "react";
import { ServerStyleSheet } from "styled-components";

import { generateCSP } from "@src/utils/generate-csp";
import { generateNonce } from "@src/utils/generate-nonce";

interface ExtendedDocumentProps extends DocumentInitialProps {
  nonce: string;
}

export default class MyDocument extends Document<ExtendedDocumentProps> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  static async getInitialProps(ctx: any): Promise<ExtendedDocumentProps> {
    const sheet = new ServerStyleSheet();

    const originalRenderPage = ctx.renderPage;

    const nonce = generateNonce();

    let res;
    if (ctx.res !== undefined) {
      res = ctx.res;
      res.setHeader("Content-Security-Policy", generateCSP(nonce));
    }

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: AppType) => (props: AppProps) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        nonce,
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
    const { nonce } = this.props;

    return (
      <Html lang="en">
        <Head nonce={nonce}>
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
          <NextScript nonce={nonce} />
        </body>
      </Html>
    );
  }
}
