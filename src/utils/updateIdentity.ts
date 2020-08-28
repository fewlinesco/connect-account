import { HttpVerbs } from "../../src/@types/HttpVerbs";
import { fetchJson } from "./fetchJson";

type UpdateBody = {
  userId: string;
  type: string;
  value: string;
};

export async function updateIdentity(
  updateBody: UpdateBody,
  deleteBody: UpdateBody,
): Promise<void> {
  fetchJson("/api/account", HttpVerbs.POST, updateBody).then(
    async (response) => {
      if (response.ok) {
        await fetchJson("/api/account", HttpVerbs.DELETE, deleteBody);
      }
    },
  );
}
