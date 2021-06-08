import React from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { Form } from "@src/components/forms/form";
import { InputsRadio } from "@src/components/input/input-radio-button";
import { WrongInputError } from "@src/components/input/wrong-input-error";
import { fetchJson } from "@src/utils/fetch-json";

const Locale: React.FC = () => {
  const availableLanguage = ["English", "Français"];
  const [formID, setFormID] = React.useState<string>(uuidv4());
  const [locale, setLocale] = React.useState<string>(availableLanguage[0]);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

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

              return;
            },
          );
        }}
      >
        <InputsRadio
          groupName="language"
          inputsValues={availableLanguage}
          selectedInput={locale}
          onChange={({ target }) => setLocale(target.value)}
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
