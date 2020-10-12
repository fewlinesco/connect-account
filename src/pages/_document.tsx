import * as Sentry from "@sentry/node";
import type { AppProps } from "next/app";
import type {
  AppType,
  DocumentInitialProps,
} from "next/dist/next-server/lib/utils";
import Document, { Html, Head, Main, NextScript } from "next/document";
import React from "react";
import { ServerStyleSheet } from "styled-components";

process.on("unhandledRejection", (error: Error): void => {
  Sentry.captureException(error);
});

export default class MyDocument extends Document {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  static async getInitialProps(ctx: any): Promise<DocumentInitialProps> {
    Sentry.addBreadcrumb({
      category: "pages/_document",
      message: `Rendering _document`,
      level: Sentry.Severity.Debug,
    });

    const sheet = new ServerStyleSheet();

    const originalRenderPage = ctx.renderPage;

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  render(): any {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap"
            rel="stylesheet"
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
