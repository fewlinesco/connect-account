import { createGlobalStyle, DefaultTheme } from "styled-components";

const GlobalStyle = createGlobalStyle<{ theme: DefaultTheme }>`
	html {
		/* This font size means that '1rem' is exactly equal to '10px', which makes setting REM values very simple. */
		font-size: 62.5%;
	}

	html, body, div, span, applet, object, iframe,
	h1, h2, h3, h4, h5, h6, p, blockquote, pre,
	a, abbr, acronym, address, big, cite, code,
	del, dfn, em, img, ins, kbd, q, s, samp,
	small, strike, strong, sub, sup, tt, var,
	b, u, i, center,
	dl, dt, dd, ol, ul, li,
	fieldset, form, label, legend,
	table, caption, tbody, tfoot, thead, tr, th, td,
	article, aside, canvas, details, embed,
	figure, figcaption, footer, header, hgroup,
	menu, nav, output, ruby, section, summary,
	time, mark, audio, video, button {
		margin: 0;
		padding: 0;
		border: 0;
		font-family: ${({ theme }) => theme.fonts.openSans};
		vertical-align: baseline;
		scroll-behavior: smooth;
	}

	/* HTML5 display-role reset for older browsers */
	article, aside, details, figcaption, figure,
	footer, header, hgroup, menu, nav, section {
		display: block;
	}

	body {
		background-color: ${({ theme }) => theme.colors.background};
		line-height: ${({ theme }) => theme.lineHeights.solid};
		color: ${({ theme }) => theme.colors.black};
		font-size: ${({ theme }) => theme.fontSizes.paragraph};
	}

	h1 {
		font-size: ${({ theme }) => theme.fontSizes.h1};
	}

	h2 {
		font-size: ${({ theme }) => theme.fontSizes.h2};
	}
	
	h3 {
		font-size: ${({ theme }) => theme.fontSizes.h3};
		font-weight: ${({ theme }) => theme.fontWeights.normal};
		color: ${({ theme }) => theme.colors.breadcrumbs};
	}

	p {
		font-size: ${({ theme }) => theme.fontSizes.paragraph};
	}

	ol, ul {
		list-style: none;
	}

	blockquote, q {
		quotes: none;
	}

	blockquote:before, blockquote:after,
	q:before, q:after {
		content: '';
		content: none;
	}

	table {
		border-collapse: collapse;
		border-spacing: 0;
	}

	button {
		border: none;
	}

	*, *:before, *:after {
		box-sizing: border-box;
	}

	th {
		text-align: left;
	}

	input {
		border: none;
		background-color: transparent;
		color: inherit;
		padding: 0;
		margin: 0;
	}
`;

export { GlobalStyle };
