import fetch from "node-fetch";

async function createE2eCheckRun(): Promise<void> {
  if (process.env.GITHUB_CONTEXT_EVENT === undefined) {
    throw new Error("GITHUB_CONTEXT_EVENT environment variable is undefined");
  }

  const githubActionsContext = JSON.parse(process.env.GITHUB_CONTEXT_EVENT);

  if (process.env.GITHUB_TOKEN === undefined) {
    throw new Error("GITHUB_TOKEN environment variable is undefined");
  }

  const checkSuiteList = await fetch(
    `https://api.github.com/repos/fewlinesco/connect-account/commits/${githubActionsContext.pull_request.head.sha}/check-runs`,
    { method: "GET" },
  )
    .then((response) => response.json())
    .then((checkSuite) => {
      return checkSuite.check_runs;
    })
    .catch((error) => {
      throw error;
    });

  // console.log("checkSuiteList: ", checkSuiteList);

  const customCheckRun = checkSuiteList.filter(
    (check: Record<string, unknown>) => check.name === "e2e-check-run",
  );

  console.log("customCheckRun: ", customCheckRun);

  if (customCheckRun.length) {
    const updatedCheckRun = await fetch(
      `https://api.github.com/repos/fewlinesco/connect-account/check-runs/${customCheckRun[0].id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
        body: JSON.stringify({ name: "e2e-check-run-old" }),
      },
    )
      .then((response) => response.json())
      .catch((error) => {
        throw error;
      });

    console.log("updatedCheckRun: ", updatedCheckRun);
  }

  const checkRunBody = {
    name: "e2e-check-run",
    head_sha: githubActionsContext.pull_request.head.sha,
  };

  const checkRunCreated = await fetch(
    "https://api.github.com/repos/fewlinesco/connect-account/check-runs",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify(checkRunBody),
    },
  ).then((response) => response.json());

  console.log("checkRunCreated: ", checkRunCreated);

  const checkSuiteListUpdated = await fetch(
    `https://api.github.com/repos/fewlinesco/connect-account/commits/${githubActionsContext.pull_request.head.sha}/check-runs`,
    { method: "GET" },
  )
    .then((response) => response.json())
    .then((checkSuite) => {
      return checkSuite.check_runs;
    })
    .catch((error) => {
      throw error;
    });

  console.log("checkSuiteListUpdated: ", checkSuiteListUpdated);
}

createE2eCheckRun();
