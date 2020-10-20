import { capitalizeFirstLetter } from "@src/utils/format";

describe("capitalizeFirstLetter", () => {
  test("Capitalize the forst letter of a string", () => {
    expect(capitalizeFirstLetter("foo")).toBe("foo");
    expect(capitalizeFirstLetter("foo bar")).toBe("Foo bar");
  });
});
