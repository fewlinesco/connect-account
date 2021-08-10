import { HttpStatus } from "@fwl/web";
import { Router } from "next/router";

import { SWRError } from "@src/errors/errors";

async function profileOverviewSWRFetcher<T>(
  url: string,
  router: Router,
): Promise<T> {
  return await fetch(url).then(async (response) => {
    if (!response.ok) {
      if (response.status === HttpStatus.NOT_FOUND) {
        router && router.replace("/account/profile/user-profile/new/");
        return;
      }

      const error = new SWRError("An error occurred while fetching the data.");
      error.info = await response.json();
      error.statusCode = response.status;
      throw error;
    }

    return response.json();
  });
}

export { profileOverviewSWRFetcher };
