async function cleaningProfileStaging(): Promise<void> {
  if (process.env.CONNECT_TEST_USER_SUB === undefined) {
    throw new Error("CONNECT_TEST_USER_SUB environment variable is undefined");
  }

  console.log(process.env.CONNECT_TEST_USER_SUB);
}

cleaningProfileStaging();

export {};
