import fs from "fs";
import path from "path";

function castLHManifestJSONToHTML() {
  const manifestPath = path.join(process.cwd(), "./lhci_reports/manifest.json");
  const manifestContent = fs.readFileSync(manifestPath);

  console.log(manifestContent);
  JSON.parse();
}

castLHManifestJSONToHTML();
