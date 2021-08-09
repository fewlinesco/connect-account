import { HttpStatus } from "@fwl/web";
import { Router } from "next/router";

import { Profile } from "@src/@types/profile";
import { SWRError } from "@src/errors/errors";

async function newProfileSWRFetcher(
  url: string,
  router: Router,
): Promise<Profile | undefined> {
  return await fetch(url).then(async (response) => {
    if (!response.ok) {
      if (response.status === HttpStatus.NOT_FOUND) {
        return;
      }

      const error = new SWRError("An error occurred while fetching the data.");
      error.info = await response.json();
      error.statusCode = response.status;
      throw error;
    }

    router && router.replace("/account/profile/");
    return response.json();
  });
}

export { newProfileSWRFetcher };
