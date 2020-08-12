import * as Sentry from "@sentry/node";
import { AppProps } from "next/app";
import { AppType, DocumentInitialProps } from "next/dist/next-server/lib/utils";
import Document from "next/document";
import React from "react";
import { ServerStyleSheet } from "styled-components";

process.on("unhandledRejection", (error: Error): void => {
  Sentry.captureException(error);
});

export default class MyDocument extends Document {
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
}
