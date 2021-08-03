import fs from "fs";
import path from "path";

function castLighthouseJSONManifestToHTML() {
  const manifestContent = JSON.parse(
    fs
      .readFileSync(path.join(process.cwd(), "./lhci_reports/manifest.json"))
      .toString(),
  );

  const HTMLManifest = manifestContent
    .reduce((acc, value) => {
      return (
        acc +
        `<p><strong>${value.url.replace(
          process.env.CONNECT_TEST_ACCOUNT_URL,
          "/",
        )}:</strong></p><ul><li>Performance: ${
          value.summary.performance
        }</li><li>Accessibility: ${
          value.summary.accessibility
        }</li><li>Best practice: ${
          value.summary["best-practices"]
        }</li><li>SEO: ${value.summary.seo}</li></ul><hr>`
      );
    }, `{"body": "<details><summary>Click here to see the Lighthouse manifest</summary><br>`)
    .concat("", '</details>"}');

  return fs.writeFile(
    path.join(process.cwd(), "./html-manifest.txt"),
    HTMLManifest,
    (error) => {
      if (error) {
        throw error;
      }

      return;
    },
  );
}

castLighthouseJSONManifestToHTML();
