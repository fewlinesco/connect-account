import { AppProps } from "next/app";
import { AppType } from "next/dist/next-server/lib/utils";
import Document from "next/document";
import { ServerStyleSheet } from "styled-components";
import React from "react";

export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: any,
  ): Promise<{
    styles: JSX.Element;
    html: string;
    head?: (JSX.Element | null)[] | undefined;
  }> {
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
