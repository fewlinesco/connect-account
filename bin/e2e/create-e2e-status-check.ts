import fetch from "node-fetch";

async function createE2eStatusCheck(): Promise<void> {
  if (process.env.GITHUB_CONTEXT_EVENT === undefined) {
    throw new Error("GITHUB_CONTEXT_EVENT environment variable is undefined");
  }

  const githubActionsContext = JSON.parse(process.env.GITHUB_CONTEXT_EVENT);

  if (process.env.GITHUB_TOKEN === undefined) {
    throw new Error("GITHUB_TOKEN environment variable is undefined");
  }

  const hasDeploymentFailed =
    githubActionsContext.deployment_status.state === "failure";

  const checkSuiteList = await fetch(
    `https://api.github.com/repos/fewlinesco/connect-account/commits/${githubActionsContext.deployment.sha}/check-runs`,
    { method: "GET" },
  )
    .then((response) => response.json())
    .then((checkSuite) => {
      return checkSuite.check_runs;
    })
    .catch((error) => {
      throw error;
    });

  const e2eCheckRun = checkSuiteList.filter(
    (check: Record<string, unknown>) =>
      check.name === "e2e-tests" && check.conclusion !== "skipped",
  );

  const statusCheckBody = {
    context: "e2e tests",
    description: "Something",
    state: hasDeploymentFailed ? "failure" : e2eCheckRun[0].conclusion,
  };

  await fetch(
    `https://api.github.com/repos/fewlinesco/connect-account/statuses/${githubActionsContext.deployment.sha}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify(statusCheckBody),
    },
  ).catch((error) => {
    throw error;
  });
}

createE2eStatusCheck();
