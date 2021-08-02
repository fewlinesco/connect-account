import fs from "fs";
import path from "path";

function castLighthouseJSONManifestToHTML() {
  fs.writeFile(
    "HTMLManifest.txt",
    JSON.parse(
      fs
        .readFileSync(path.join(process.cwd(), "./lhci_reports/manifest.json"))
        .toString(),
    )
      .reduce((acc, value) => {
        return (
          acc +
          `<p>${value.url.replace(
            process.env.CONNECT_TEST_ACCOUNT_URL,
            "/",
          )}:</p><br>${value.summary.performance}<br>${
            value.summary.accessibility
          }<br>${value.summary["best-practices"]}<br>${value.summary.seo}<br>`
        );
      }, `{body: "<details><summary>Click here to see the Lighthouse manifest</summary>`)
      .concat("", '</details>};"'),
    (error) => {
      if (error) {
        throw error;
      }

      console.log("HTMLManifest.txt saved.");
    },
  );
}

castLighthouseJSONManifestToHTML();
