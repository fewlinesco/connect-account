module.exports = {
  ci: {
    collect: {
      puppeteerScript: "./bin/lighthouse/lighthouse-report.js",
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
      disableStorageReset: false,
      settings: {
        maxWaitForLoad: 60000,
      },
      url: [
        process.env.CONNECT_TEST_ACCOUNT_URL,
        `${process.env.CONNECT_TEST_ACCOUNT_URL}account/`,
        `${process.env.CONNECT_TEST_ACCOUNT_URL}account/profile/`,
        `${process.env.CONNECT_TEST_ACCOUNT_URL}account/profile/user-profile/new/`,
        `${process.env.CONNECT_TEST_ACCOUNT_URL}account/logins/`,
        `${process.env.CONNECT_TEST_ACCOUNT_URL}account/logins/email/new/`,
        `${process.env.CONNECT_TEST_ACCOUNT_URL}account/logins/phone/new/`,
        `${process.env.CONNECT_TEST_ACCOUNT_URL}account/security/`,
        `${process.env.CONNECT_TEST_ACCOUNT_URL}account/security/sudo/`,
        `${process.env.CONNECT_TEST_ACCOUNT_URL}account/locale/`,
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
