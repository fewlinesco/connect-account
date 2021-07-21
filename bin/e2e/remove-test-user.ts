import {
  deleteUser,
  getUserIdFromIdentityValue,
} from "@fewlines/connect-management";

async function removeTestUser(): Promise<string> {
  if (process.env.CIRCLE_SHA1 === undefined) {
    throw new Error("CIRCLE_SHA1 environment variable is undefined");
  }

  if (process.env.CONNECT_TEST_ACCOUNT_EMAIL === undefined) {
    throw new Error(
      "CONNECT_TEST_ACCOUNT_EMAIL environment variable is undefined",
    );
  }

  if (process.env.CONNECT_MANAGEMENT_URL === undefined) {
    throw new Error("CONNECT_MANAGEMENT_URL environment variable is undefined");
  }

  if (process.env.CONNECT_MANAGEMENT_API_KEY === undefined) {
    throw new Error(
      "CONNECT_MANAGEMENT_API_KEY environment variable is undefined",
    );
  }

  const testUserEmail = process.env.CONNECT_TEST_ACCOUNT_EMAIL.split("@").join(
    "_" + process.env.CIRCLE_SHA1 + "@",
  );

  const testUserId = await getUserIdFromIdentityValue(
    {
      URI: process.env.CONNECT_MANAGEMENT_URL,
      APIKey: process.env.CONNECT_MANAGEMENT_API_KEY,
    },
    testUserEmail,
  );

  await deleteUser(
    {
      URI: process.env.CONNECT_MANAGEMENT_URL,
      APIKey: process.env.CONNECT_MANAGEMENT_API_KEY,
    },
    testUserId,
  );

  return testUserId;
}

removeTestUser()
  .then((userId) =>
    console.log(`✅ User with id "${userId}" has been deleted.`),
  )
  .catch((error) => {
    console.error("💥", error);
    process.exit(1);
  });
