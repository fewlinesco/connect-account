import { screen } from "../config/testing-library-config";

async function findByTextContent(textMatch: string): Promise<HTMLElement> {
  return screen.findByText((content, node) => {
    const hasText = (node: Element): boolean => node.textContent === textMatch;
    const nodeHasText = hasText(node as Element);
    const childrenDontHaveText = Array.from(node?.children || []).every(
      (child) => !hasText(child),
    );

    return nodeHasText && childrenDontHaveText;
  });
}

export { findByTextContent };
