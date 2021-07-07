import { HttpStatus } from "@fwl/web";

import {
  ConnectProfileAdminApi,
  Configuration,
} from "../../connect-profile-client";

const adminClient = new ConnectProfileAdminApi(
  new Configuration({
    apiKey: `API_KEY ${process.env.PROFILE_API_KEY}`,
    basePath: process.env.CONNECT_PROFILE_URL,
  }),
);

adminClient
  .deleteProfile(process.env.CONNECT_TEST_ACCOUNT_SUB || "")
  .then((response) => {
    if (response.status === HttpStatus.NO_CONTENT) {
      console.log(
        `✅ Profile with sub '${process.env.CONNECT_TEST_ACCOUNT_SUB}' deleted from Connect.Profile`,
      );
    }
  })
  .catch((error) => {
    if (!(error.message === "Request failed with status code 404")) {
      console.error("💥", error.message);
      process.exit(1);
    }
  });
