import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import useSWR from "swr";
import { v4 as uuidv4 } from "uuid";

import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { Form } from "@src/components/forms/form";
import { InputsRadio } from "@src/components/input/input-radio-button";
import { WrongInputError } from "@src/components/input/wrong-input-error";
import { SWRError } from "@src/errors/errors";
import { fetchJson } from "@src/utils/fetch-json";

const Locale: React.FC = () => {
  const router = useRouter();
  const [formID, setFormID] = React.useState<string>(uuidv4());
  const [locale, setLocale] = React.useState<string>("en");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const { data } = useSWR<{ locale: string }, SWRError>(
    `/api/locale/get-locale`,
  );

  React.useEffect(() => {
    data && setLocale(data.locale);
  }, [data]);

  if (!data) {
    return <React.Fragment />;
  }

  const availableLanguage: { [key: string]: string; en: string; fr: string } = {
    en: "English",
    fr: "Français",
  };

  return (
    <>
      {errorMessage ? <WrongInputError>{errorMessage}.</WrongInputError> : null}
      <Form
        formID={formID}
        onSubmit={async () => {
          await fetchJson("/api/locale/set-locale", "POST", { locale }).then(
            async (response) => {
              const parsedResponse = await response.json();

              if ("message" in parsedResponse) {
                setErrorMessage("Something went wrong. Please try again later");
                setFormID(uuidv4());
              }

              if ("updatedUser" in parsedResponse) {
                router && router.push("/account");
              }

              return;
            },
          );
        }}
      >
        <InputsRadio
          groupName="language"
          inputsValues={Object.values(availableLanguage)}
          selectedInput={availableLanguage[locale]}
          onChange={({ target }) => {
            const targetedLocale = Object.keys(availableLanguage).find(
              (key) => availableLanguage[key] === target.value,
            );

            setLocale(targetedLocale ? targetedLocale : "en");
          }}
        />
        <Button variant={ButtonVariant.PRIMARY} type="submit">
          Set your preferred locale
        </Button>
      </Form>
    </>
  );
};

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: ${({ theme }) => theme.spaces.xxs} 0;
  height: 4.8rem;
`;

export { Locale, ListItem };
