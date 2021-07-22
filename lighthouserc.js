module.exports = {
  ci: {
    collect: {
      puppeteerScript: "./bin/lighthouse-report.js",
      puppeteerLaunchOptions: {
        args: [
          "--allow-no-sandbox-job",
          "--allow-sandbox-debugging",
          "--no-sandbox",
          "--disable-gpu",
          "--disable-gpu-sandbox",
          "--display",
        ],
      },
      numberOfRuns: 1,
      settings: {
        maxWaitForLoad: 60000,
      },
      url: [
        process.env.CONNECT_TEST_ACCOUNT_URL,
        `${process.env.CONNECT_TEST_ACCOUNT_URL}/account/logins`,
        `${process.env.CONNECT_TEST_ACCOUNT_URL}/account/profile`,
      ],
    },
    upload: {
      target: "filesystem",
      outputDir: "./lhci_reports",
      reportFilenamePattern: "%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%",
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.8 }],
        "categories:accessibility": ["error", { minScore: 0.8 }],
        "categories:best-practices": ["error", { minScore: 0.8 }],
        "categories:seo": ["error", { minScore: 0.8 }],
      },
    },
  },
};
