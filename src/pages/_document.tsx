import Document, {
  Html,
  Main,
  Head,
  NextScript,
  DocumentInitialProps,
  DocumentContext,
} from "next/document";
import React from "react";

import { generateCSP } from "@src/utils/generate-csp";
import { generateNonce } from "@src/utils/generate-nonce";

interface ExtendedDocumentProps extends DocumentInitialProps {
  nonce: string;
}

export default class MyDocument extends Document<ExtendedDocumentProps> {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<ExtendedDocumentProps> {
    const initialProps = await Document.getInitialProps(ctx);
    const nonce = generateNonce();

    let res;
    if (ctx.res !== undefined) {
      res = ctx.res;
      res.setHeader("Content-Security-Policy", generateCSP(nonce));
    }

    return {
      ...initialProps,
      nonce,
    };
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
