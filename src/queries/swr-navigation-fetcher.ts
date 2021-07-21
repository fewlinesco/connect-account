import { HttpStatus } from "@fwl/web";

import { Profile } from "@src/@types/profile";
import { SWRError } from "@src/errors/errors";

async function navigationFetcher(url: string): Promise<Profile> {
  return await fetch(url).then(async (response) => {
    if (!response.ok) {
      const error = new SWRError(
        "An error occurred while fetching the UserProfile.",
      );

      if (response.status === HttpStatus.NOT_FOUND) {
        error.info = await response.json();
        error.statusCode = response.status;
        return;
      }

      error.info = await response.json();
      error.statusCode = response.status;
      throw error;
    }

    return response.json();
  });
}

export { navigationFetcher };
