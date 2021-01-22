import fetch from "node-fetch";

async function updateE2eCheckRunStatus(): Promise<void> {
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

  console.log(checkSuiteList);

  const e2eCustomCheckRun = checkSuiteList.filter(
    (check: Record<string, unknown>) => check.name === "e2e-check-run",
  );

  console.log("e2eCustomCheckRun: ", e2eCustomCheckRun);

  const e2eCheckRun = checkSuiteList.filter(
    (check: Record<string, unknown>) =>
      check.name === "e2e-tests" && check.conclusion !== "skipped",
  );

  console.log("e2eCheckRun: ", e2eCheckRun);

  const checkRunBody = {
    status: "completed",
    conclusion: hasDeploymentFailed ? "failure" : e2eCheckRun[0].conclusion,
  };

  await fetch(
    `https://api.github.com/repos/fewlinesco/connect-account/check-runs/${e2eCustomCheckRun[0].id}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify(checkRunBody),
    },
  ).catch((error) => {
    throw error;
  });
}

updateE2eCheckRunStatus();
