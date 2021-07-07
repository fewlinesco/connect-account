import { HttpStatus } from "@fwl/web";

import {
  Configuration,
  ConnectProfileAdminApi,
} from "../../connect-profile-client";

async function cleaningProfileStaging(): Promise<void> {
  if (process.env.CONNECT_TEST_ACCOUNT_SUB === undefined) {
    throw new Error(
      "CONNECT_TEST_ACCOUNT_SUB environment variable is undefined",
    );
  }

  if (process.env.CONNECT_PROFILE_API_KEY === undefined) {
    throw new Error(
      "CONNECT_PROFILE_API_KEY environment variable is undefined",
    );
  }

  if (process.env.CONNECT_PROFILE_URL === undefined) {
    throw new Error("CONNECT_PROFILE_URL environment variable is undefined");
  }

  const basePath = process.env.CONNECT_PROFILE_URL.replace(/\/?$/, "");
  const apiKey = `API_KEY ${process.env.CONNECT_PROFILE_API_KEY}`;

  const profileAdminClient = new ConnectProfileAdminApi(
    new Configuration({
      apiKey,
      basePath,
    }),
  );

  try {
    await profileAdminClient.deleteProfile(
      process.env.CONNECT_TEST_ACCOUNT_SUB,
    );
    console.log("✅ Test user profile deleted");
  } catch (error) {
    if (error.response.status === HttpStatus.UNAUTHORIZED) {
      throw new Error("💥 Unauthorized admin access");
    }

    if (error.response.status === HttpStatus.NOT_FOUND) {
      console.log("🤖 The user doesn't exist in Connect.Profile's database");
      return;
    }

    throw new Error(
      "💥 Something went wrong, you should manually delete the user profile",
    );
  }
}

cleaningProfileStaging().catch((error) => console.error(error.message));
