import Link from "next/link";
import React from "react";

import { Button, ButtonVariant } from "../Button/Button";
import { Form } from "../Form/Form";
import { Input } from "../Input/Input";
import { NeutralLink } from "../NeutralLink";
import { IdentityTypes } from "@lib/@types";
import { InMemoryTemporaryIdentity } from "@src/@types/InMemoryTemporaryIdentity";

type AddIdentityFormProps = {
  type: IdentityTypes;
  addIdentity: (identity: InMemoryTemporaryIdentity) => Promise<void>;
};

export const AddIdentityForm: React.FC<AddIdentityFormProps> = ({
  type,
  addIdentity,
}) => {
  const [identity, setIdentity] = React.useState<InMemoryTemporaryIdentity>({
    value: "",
    type,
    expiresAt: Date.now(),
  });

  return (
    <>
      <Form
        onSubmit={async () => {
          await addIdentity(identity);
        }}
      >
        <p>
          {type.toLocaleUpperCase() === IdentityTypes.PHONE
            ? "phone number"
            : "email address"}{" "}
          *
        </p>
        <Input
          type="text"
          name="value"
          placeholder={`Enter your ${type.toLowerCase()}`}
          value={identity.value}
          onChange={(event) =>
            setIdentity({
              value: event.target.value,
              type,
              expiresAt: Date.now() + 300,
            })
          }
        />
        <Button
          variant={ButtonVariant.PRIMARY}
          type="submit"
        >{`Add ${type.toLowerCase()}`}</Button>
      </Form>
      <Link href="/account/logins" passHref>
        <NeutralLink>
          <Button variant={ButtonVariant.SECONDARY}>Cancel</Button>
        </NeutralLink>
      </Link>
    </>
  );
};
