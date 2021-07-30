import { exec } from "child_process";
import fs from "fs";
import path from "path";

function castLighthouseJSONManifestToHTML() {
  const manifestPath = path.join(process.cwd(), "./lhci_reports/manifest.json");
  const manifestContent = fs.readFileSync(manifestPath).toString();
  const parsedManifestContent = JSON.parse(manifestContent);
  const GHComment = `
      <details>
        <summary>Click here to see the Lighthouse manifest</summary>
    `;

  parsedManifestContent.forEach((element) => {
    const x = `
      <p>${element.url}<p>
    `;
    GHComment.concat("", x);
  });

  GHComment.concat("", "</details>");

  exec(`
    pr_response=$(curl --location --request GET "https://api.github.com/repos/$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME/pulls?head=$CIRCLE_PROJECT_USERNAME:$CIRCLE_BRANCH&state=open" \
    -u $FRIEDA_GH_USER:$FRIEDA_GH_PAT)

    if [ $(echo $pr_response | jq length) -eq 0 ]; then
      echo "No PR found to update"
    else
      pr_comment_url=$(echo $pr_response | jq -r ".[]._links.comments.href")
    fi

    curl --location --request POST "$pr_comment_url" \
      -u $FRIEDA_GH_USER:$FRIEDA_GH_PAT \
      --header 'Content-Type: application/json' \
      -H "Accept: application/vnd.github.v3+json" \
      --data ${GHComment}
  `);
}

castLighthouseJSONManifestToHTML();
