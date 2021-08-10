import { CSP } from "@src/@types/csp-header-directives";

function generateCSP(): string {
  const csp: Partial<Record<CSP, string>> = {
    "default-src": `'self'`,
    "script-src": "'self'",
    "connect-src": "'self' *.sentry.io",
    "img-src": "'self'",
    "style-src": "'self",
    "base-uri": "'self'",
    "form-action": "'self'",
  };

  // Override directives outside production because Nextjs dev env uses eval() and inline script injection for fast refresh
  if (process.env.NODE_ENV !== "production") {
    csp["script-src"] = `'self' 'unsafe-eval' 'unsafe-inline'`;
    csp["style-src"] = `'self' 'unsafe-inline'`;
  }

  return Object.entries(csp).reduce(
    (acc, [key, val]) => `${acc} ${key} ${val};`,
    "",
  );
}

export { generateCSP };
