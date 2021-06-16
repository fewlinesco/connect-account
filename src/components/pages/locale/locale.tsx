import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import useSWR from "swr";
import { v4 as uuidv4 } from "uuid";

import { Button, ButtonVariant } from "@src/components/buttons/buttons";
import { Form } from "@src/components/forms/form";
import { FormErrorMessage } from "@src/components/input/form-error-message";
import { InputsRadio } from "@src/components/input/input-radio-button";
import { SWRError } from "@src/errors/errors";
import { fetchJson } from "@src/utils/fetch-json";
import { AVAILABLE_LANGUAGE, getLocaleKey } from "@src/utils/get-locale";

const Locale: React.FC = () => {
  const router = useRouter();
  const [formID, setFormID] = React.useState<string>(uuidv4());
  const [locale, setLocale] = React.useState<string>("en");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const { data: fetchedLocale } = useSWR<string, SWRError>(`/api/locale`);

  React.useEffect(() => {
    fetchedLocale && setLocale(fetchedLocale);
  }, [fetchedLocale]);

  return (
    <>
      {errorMessage ? (
        <FormErrorMessage>{errorMessage}.</FormErrorMessage>
      ) : null}
      <Form
        formID={formID}
        onSubmit={async () => {
          if (!fetchedLocale) {
            return;
          }

          await fetchJson("/api/locale", "PATCH", { locale }).then(
            async (response) => {
              if (response.status >= 400) {
                setErrorMessage("Something went wrong. Please try again later");
                setFormID(uuidv4());
                return;
              }

              router && router.push(`/account`, undefined, { locale });
              return;
            },
          );
        }}
      >
        <InputsRadio
          groupName="language"
          inputsValues={Object.values(AVAILABLE_LANGUAGE)}
          selectedInput={AVAILABLE_LANGUAGE[locale]}
          onChange={({ target }) => {
            setLocale(getLocaleKey(target.value));
          }}
          isReady={fetchedLocale ? true : false}
        />
        {fetchedLocale ? (
          <Button variant={ButtonVariant.PRIMARY} type="submit">
            Set your preferred locale
          </Button>
        ) : null}
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
