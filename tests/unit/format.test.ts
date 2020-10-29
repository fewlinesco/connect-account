import {
  capitalizeFirstLetter,
  formatSpecialSocialIdentities,
} from "@src/utils/format";

describe("capitalizeFirstLetter", () => {
  test("Capitalize the first letter of a string", () => {
    expect(capitalizeFirstLetter("foo")).toBe("Foo");
    expect(capitalizeFirstLetter("foo bar")).toBe("Foo bar");
  });
});

describe("formatSpecialSocialIdentities", () => {
  test("should format KakaoTalk", () => {
    expect(formatSpecialSocialIdentities("KAKAO_TALK")).toStrictEqual(
      "KakaoTalk",
    );
  });

  test("should format VKontakte", () => {
    expect(formatSpecialSocialIdentities("VKONTAKTE")).toStrictEqual(
      "VKontakte",
    );
  });
});
