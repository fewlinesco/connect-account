// import {
//   createOrUpdatePassword,
//   createUserWithIdentities,
// } from "@fewlines/connect-management";
// import {
//   IdentityStatus,
//   IdentityTypes,
// } from "@fewlines/connect-management/dist/src/types";

async function createTestUser(): Promise<void> {
  // if (process.env.CIRCLE_SHA1 === undefined) {
  throw new Error("CIRCLE_SHA1 environment variable is undefined");
  // }

  // if (process.env.CONNECT_TEST_ACCOUNT_EMAIL === undefined) {
  //   throw new Error(
  //     "CONNECT_TEST_ACCOUNT_EMAIL environment variable is undefined",
  //   );
  // }

  // if (process.env.CONNECT_TEST_ACCOUNT_PASSWORD === undefined) {
  //   throw new Error(
  //     "CONNECT_TEST_ACCOUNT_PASSWORD environment variable is undefined",
  //   );
  // }

  // if (process.env.CONNECT_MANAGEMENT_URL === undefined) {
  //   throw new Error("CONNECT_MANAGEMENT_URL environment variable is undefined");
  // }

  // if (process.env.CONNECT_MANAGEMENT_API_KEY === undefined) {
  //   throw new Error(
  //     "CONNECT_MANAGEMENT_API_KEY environment variable is undefined",
  //   );
  // }

  // const userIdentitiesInput = [
  //   {
  //     status: IdentityStatus.VALIDATED,
  //     type: IdentityTypes.EMAIL,
  //     value: process.env.CONNECT_TEST_ACCOUNT_EMAIL.split("@").join(
  //       "_" + process.env.CIRCLE_SHA1 + "@",
  //     ),
  //   },
  //   {
  //     status: IdentityStatus.VALIDATED,
  //     type: IdentityTypes.EMAIL,
  //     value: process.env.CONNECT_TEST_ACCOUNT_EMAIL.split("@").join(
  //       "_delete_" + process.env.CIRCLE_SHA1 + "@",
  //     ),
  //   },
  //   {
  //     status: IdentityStatus.VALIDATED,
  //     type: IdentityTypes.EMAIL,
  //     value: process.env.CONNECT_TEST_ACCOUNT_EMAIL.split("@").join(
  //       "2_" + process.env.CIRCLE_SHA1 + "@",
  //     ),
  //   },
  // ];

  // const userId = await createUserWithIdentities(
  //   {
  //     URI: process.env.CONNECT_MANAGEMENT_URL,
  //     APIKey: process.env.CONNECT_MANAGEMENT_API_KEY,
  //   },
  //   {
  //     identities: userIdentitiesInput,
  //     localeCode: "en-US",
  //   },
  // );

  // await createOrUpdatePassword(
  //   {
  //     URI: process.env.CONNECT_MANAGEMENT_URL,
  //     APIKey: process.env.CONNECT_MANAGEMENT_API_KEY,
  //   },
  //   {
  //     cleartextPassword: process.env.CONNECT_TEST_ACCOUNT_PASSWORD.trim(),
  //     userId,
  //   },
  // );

  // return userId;
}

createTestUser()
  .then((userId) => console.log(`✅ User created created with id:${userId}`))
  .catch((error) => {
    console.error("💥", error);
    process.exit(1);
  });

export {};
