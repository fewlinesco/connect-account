import { Identity, IdentityTypes } from "@lib/@types";
import { sortIdentities } from "@src/utils/sort-identities";

describe("sortIdentities", () => {
  it("should render properly with 1 entry arrays", () => {
    const mockedIdentities: Identity[] = [
      {
        id: "7f8d168a-3f65-4636-9acb-7720a212680e",
        primary: true,
        status: "validated",
        type: IdentityTypes.PHONE,
        value: "0123456789",
      },
      {
        id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
        primary: true,
        status: "validated",
        type: IdentityTypes.EMAIL,
        value: "test@test.test",
      },
      {
        id: "5z8d168a-3f65-4636-9acb-7720a212543r",
        primary: true,
        status: "validated",
        type: IdentityTypes.GITHUB,
        value: "test@test.test",
      },
    ];

    const mockedSortedIdentities = {
      emailIdentities: [
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: true,
          status: "validated",
          type: IdentityTypes.EMAIL,
          value: "test@test.test",
        },
      ],
      phoneIdentities: [
        {
          id: "7f8d168a-3f65-4636-9acb-7720a212680e",
          primary: true,
          status: "validated",
          type: IdentityTypes.PHONE,
          value: "0123456789",
        },
      ],
      socialIdentities: [
        {
          id: "5z8d168a-3f65-4636-9acb-7720a212543r",
          primary: true,
          status: "validated",
          type: IdentityTypes.GITHUB,
          value: "test@test.test",
        },
      ],
    };

    const sortedIdentities = sortIdentities(mockedIdentities);
    expect(sortedIdentities).toStrictEqual(mockedSortedIdentities);
  });

  it("should render properly if it receives empty arrays", () => {
    const mockedIdentities: Identity[] = [];

    const mockedSortedIdentities = {
      emailIdentities: [],
      phoneIdentities: [],
      socialIdentities: [],
    };

    const sortedIdentities = sortIdentities(mockedIdentities);
    expect(sortedIdentities).toStrictEqual(mockedSortedIdentities);
  });

  it("should render properly if it receives only social logins", () => {
    const mockedIdentities: Identity[] = [
      {
        id: "7f8d168a-3f65-4636-9acb-7720a212680e",
        primary: true,
        status: "validated",
        type: IdentityTypes.FACEBOOK,
        value: "test@test.test",
      },
      {
        id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
        primary: false,
        status: "validated",
        type: IdentityTypes.GOOGLE,
        value: "test@test.test",
      },
    ];

    const mockedSortedIdentities = {
      emailIdentities: [],
      phoneIdentities: [],
      socialIdentities: [
        {
          id: "7f8d168a-3f65-4636-9acb-7720a212680e",
          primary: true,
          status: "validated",
          type: IdentityTypes.FACEBOOK,
          value: "test@test.test",
        },
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: false,
          status: "validated",
          type: IdentityTypes.GOOGLE,
          value: "test@test.test",
        },
      ],
    };

    const sortedIdentities = sortIdentities(mockedIdentities);
    expect(sortedIdentities).toStrictEqual(mockedSortedIdentities);
  });

  it("should render properly if it receives only email", () => {
    const mockedIdentities: Identity[] = [
      {
        id: "7f8d168a-3f65-4636-9acb-7720a212680e",
        primary: true,
        status: "validated",
        type: IdentityTypes.EMAIL,
        value: "test@fewlines.local",
      },
      {
        id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
        primary: false,
        status: "validated",
        type: IdentityTypes.EMAIL,
        value: "test@test.test",
      },
    ];

    const mockedSortedIdentities = {
      emailIdentities: [
        {
          id: "7f8d168a-3f65-4636-9acb-7720a212680e",
          primary: true,
          status: "validated",
          type: IdentityTypes.EMAIL,
          value: "test@fewlines.local",
        },
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: false,
          status: "validated",
          type: IdentityTypes.EMAIL,
          value: "test@test.test",
        },
      ],
      phoneIdentities: [],
      socialIdentities: [],
    };

    const sortedIdentities = sortIdentities(mockedIdentities);
    expect(sortedIdentities).toStrictEqual(mockedSortedIdentities);
  });

  it("should render properly if it receive only phone", () => {
    const mockedIdentities: Identity[] = [
      {
        id: "7f8d168a-3f65-4636-9acb-7720a212680e",
        primary: true,
        status: "validated",
        type: IdentityTypes.PHONE,
        value: "0123456789",
      },
      {
        id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
        primary: false,
        status: "validated",
        type: IdentityTypes.PHONE,
        value: "0622116655",
      },
    ];

    const mockedSortedIdentities = {
      emailIdentities: [],
      phoneIdentities: [
        {
          id: "7f8d168a-3f65-4636-9acb-7720a212680e",
          primary: true,
          status: "validated",
          type: IdentityTypes.PHONE,
          value: "0123456789",
        },
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: false,
          status: "validated",
          type: IdentityTypes.PHONE,
          value: "0622116655",
        },
      ],
      socialIdentities: [],
    };

    const sortedIdentities = sortIdentities(mockedIdentities);
    expect(sortedIdentities).toStrictEqual(mockedSortedIdentities);
  });

  test("it should put the primary phone at the top of the list, and the validated afterwards", () => {
    const mockedIdentities: Identity[] = [
      {
        id: "7f8d168a-3f65-4636-9acb-7720a212680e",
        primary: false,
        status: "validated",
        type: IdentityTypes.PHONE,
        value: "0123456789",
      },
      {
        id: "hut67cc1-530b-4982-878d-33f0def6a7cf",
        primary: true,
        status: "validated",
        type: IdentityTypes.PHONE,
        value: "0677113322",
      },
      {
        id: "ftardcc1-530b-4982-878d-33f0def6a7cf",
        primary: false,
        status: "unvalidated",
        type: IdentityTypes.PHONE,
        value: "0677113300",
      },
    ];

    const mockedSortedIdentities = {
      emailIdentities: [],
      phoneIdentities: [
        {
          id: "hut67cc1-530b-4982-878d-33f0def6a7cf",
          primary: true,
          status: "validated",
          type: IdentityTypes.PHONE,
          value: "0677113322",
        },
        {
          id: "7f8d168a-3f65-4636-9acb-7720a212680e",
          primary: false,
          status: "validated",
          type: IdentityTypes.PHONE,
          value: "0123456789",
        },
        {
          id: "ftardcc1-530b-4982-878d-33f0def6a7cf",
          primary: false,
          status: "unvalidated",
          type: IdentityTypes.PHONE,
          value: "0677113300",
        },
      ],
      socialIdentities: [],
    };

    const sortedIdentities = sortIdentities(mockedIdentities);
    expect(sortedIdentities).toStrictEqual(mockedSortedIdentities);
  });

  test("it should put the primary email at the top of the list, and the validated afterwards", () => {
    const mockedIdentities: Identity[] = [
      {
        id: "611ed68a-3f65-4636-9acb-7720a212680e",
        primary: false,
        status: "validated",
        type: IdentityTypes.EMAIL,
        value: "test@test.test",
      },
      {
        id: "0optncc1-530b-4982-878d-33f0def6a7cf",
        primary: false,
        status: "unvalidated",
        type: IdentityTypes.EMAIL,
        value: "test2@test.test",
      },
      {
        id: "ghhg5cc1-530b-4982-878d-33f0def6a7cf",
        primary: true,
        status: "validated",
        type: IdentityTypes.EMAIL,
        value: "test3@test.test",
      },
    ];

    const mockedSortedIdentities = {
      emailIdentities: [
        {
          id: "ghhg5cc1-530b-4982-878d-33f0def6a7cf",
          primary: true,
          status: "validated",
          type: IdentityTypes.EMAIL,
          value: "test3@test.test",
        },
        {
          id: "611ed68a-3f65-4636-9acb-7720a212680e",
          primary: false,
          status: "validated",
          type: IdentityTypes.EMAIL,
          value: "test@test.test",
        },
        {
          id: "0optncc1-530b-4982-878d-33f0def6a7cf",
          primary: false,
          status: "unvalidated",
          type: IdentityTypes.EMAIL,
          value: "test2@test.test",
        },
      ],
      phoneIdentities: [],
      socialIdentities: [],
    };

    const sortedIdentities = sortIdentities(mockedIdentities);
    expect(sortedIdentities).toStrictEqual(mockedSortedIdentities);
  });

  it("should put the primary social login at the top of the list, and the validated afterwards", () => {
    const mockedIdentities: Identity[] = [
      {
        id: "7f8d168a-3f65-4636-9acb-7720a212680e",
        primary: false,
        status: "unvalidated",
        type: IdentityTypes.FACEBOOK,
        value: "test@test.test",
      },
      {
        id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
        primary: true,
        status: "validated",
        type: IdentityTypes.GOOGLE,
        value: "test@test.test",
      },
      {
        id: "5z8d168a-3f65-4636-9acb-7720a212543r",
        primary: false,
        status: "validated",
        type: IdentityTypes.GITHUB,
        value: "test@test.test",
      },
    ];

    const mockedSortedIdentities = {
      emailIdentities: [],
      phoneIdentities: [],
      socialIdentities: [
        {
          id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
          primary: true,
          status: "validated",
          type: IdentityTypes.GOOGLE,
          value: "test@test.test",
        },
        {
          id: "5z8d168a-3f65-4636-9acb-7720a212543r",
          primary: false,
          status: "validated",
          type: IdentityTypes.GITHUB,
          value: "test@test.test",
        },
        {
          id: "7f8d168a-3f65-4636-9acb-7720a212680e",
          primary: false,
          status: "unvalidated",
          type: IdentityTypes.FACEBOOK,
          value: "test@test.test",
        },
      ],
    };

    const sortedIdentities = sortIdentities(mockedIdentities);
    expect(sortedIdentities).toStrictEqual(mockedSortedIdentities);
  });

  it("should not throw error if it is an instance of UnhandledIdentityType error when given an unknown identity type", () => {
    const mockedIdentities: Identity[] = [
      {
        id: "7f8d168a-3f65-4636-9acb-7720a212680e",
        primary: false,
        status: "validated",
        type: IdentityTypes.FACEBOOK,
        value: "test@test.test",
      },
      {
        id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
        primary: true,
        status: "validated",
        type: IdentityTypes.GOOGLE,
        value: "test@test.test",
      },
      {
        id: "5z8d168a-3f65-4636-9acb-7720a212543r",
        primary: false,
        status: "validated",
        type: "gitlab" as IdentityTypes,
        value: "test@test.test",
      },
    ];

    const mockedSortedIdentities = sortIdentities(mockedIdentities);

    expect(mockedSortedIdentities.socialIdentities).toHaveLength(2);
  });
});
