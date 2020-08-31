import { HttpStatus } from "@fewlines/fwl-web";
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import { withSSRLogger } from "src/middleware/withSSRLogger";
import withSession from "src/middleware/withSession";
import styled from "styled-components";

import Sentry, { addRequestScopeToSentry } from "../../../..//utils/sentry";
import { IdentityTypes } from "../../../../@types/Identity";
import SnackBar from "../../../../components/display/fewlines/SnackBar";
import { Button } from "../../../../pages/account/logins/index";

const Validation: React.FC<{ type: IdentityTypes }> = (props) => {
  const [validationCode, setValidationCode] = React.useState("");
  const type = props.type;
  const router = useRouter();

  return (
    <>
      <Form method="post">
        <Input
          type="text"
          name="value"
          placeholder="012345"
          value={validationCode}
          onChange={(event) => setValidationCode(event.target.value)}
        />
        <SendInput type="submit" value={`Confirm ${type}`} />
      </Form>
      <Button onClick={() => router.push("/account/logins/")}>
        Discard all changes
      </Button>
      <p>Didn&apos;t receive code?</p>
      <Button>Resend confirmation code</Button>
      <SnackBar type={type} />
    </>
  );
};

export default Validation;

export const getServerSideProps: GetServerSideProps = withSSRLogger(
  withSession(async (context) => {
    addRequestScopeToSentry(context.req);
    try {
      return {
        props: {
          type: context.params.type,
        },
      };
    } catch (error) {
      if (
        error instanceof JsonWebTokenError ||
        error instanceof NotBeforeError ||
        error instanceof TokenExpiredError
      ) {
        Sentry.withScope((scope) => {
          scope.setTag(
            "/pages/account/logins SSR",
            "/pages/account/logins SSR",
          );
          Sentry.captureException(error);
        });

        context.res.statusCode = HttpStatus.TEMPORARY_REDIRECT;
        context.res.setHeader("location", context.req.headers.referer || "/");
        context.res.end();

        return { props: {} };
      }

      throw error;
    }
  }),
);

const Form = styled.form`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  border: ${({ theme }) => `${theme.colors.blacks[0]} ${theme.borders.thin}`};
  border-radius: ${({ theme }) => theme.radii[0]};
  padding: 0.5rem;

  &:active,
  &:focus {
    outline: none;
  }
`;

const SendInput = styled.input`
  color: ${({ theme }) => theme.colors.green};
  padding: 0.25em 1em;
`;
