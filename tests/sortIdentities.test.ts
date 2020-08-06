import { sortIdentities } from "../src/utils/sortIdentities";
import {
  mockedSortedResponse,
  mockedResponse,
} from "./__mocks__/managementResponse";

describe("sortIdentities", () => {
  it("should sort identities properly", () => {
    const call = sortIdentities(mockedResponse);
    expect(call).toStrictEqual(mockedSortedResponse);
  });
});
