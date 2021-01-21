import fetch from "node-fetch";

async function createE2eCheckRun(): Promise<void> {
  if (process.env.GITHUB_CONTEXT_EVENT === undefined) {
    throw new Error("GITHUB_CONTEXT_EVENT environment variable is undefined");
  }

  const githubActionsContext = JSON.parse(process.env.GITHUB_CONTEXT_EVENT);

  if (process.env.GITHUB_TOKEN === undefined) {
    throw new Error("GITHUB_TOKEN environment variable is undefined");
  }

  const checkRunBody = {
    name: "e2e-tests-check-run",
    head_sha: githubActionsContext.pull_request.head.sha,
  };

  await fetch(
    "https://api.github.com/repos/fewlinesco/connect-account/check-runs",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify(checkRunBody),
    },
  );
}

createE2eCheckRun();
