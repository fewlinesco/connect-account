import { promoteToProd } from "./promote-staging-to-prod";

promoteToProd(5)
  .then(console.log)
  .catch((error) => {
    console.log("❌", error);
    process.exit(1);
  });
