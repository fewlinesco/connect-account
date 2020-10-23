import { capitalizeFirstLetter } from "@src/utils/format";

describe("capitalizeFirstLetter", () => {
  test("Capitalize the first letter of a string", () => {
    expect(capitalizeFirstLetter("foo")).toBe("Foo");
    expect(capitalizeFirstLetter("foo bar")).toBe("Foo bar");
  });
});
