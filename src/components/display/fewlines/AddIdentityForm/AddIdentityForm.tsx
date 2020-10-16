import { useRouter } from "next/router";
import React from "react";

import { Button, ButtonVariant } from "../Button/Button";
import { Container } from "../Container";
import { Form } from "../Form/Form";
import { H1 } from "../H1/H1";
import { Input } from "../Input/Input";
import { NavigationBreadcrumbs } from "../NavigationBreadcrumbs/NavigationBreadcrumbs";
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

  const router = useRouter();

  return (
    <Container>
      <H1>Logins</H1>
      <NavigationBreadcrumbs
        breadcrumbs={[
          type === IdentityTypes.EMAIL ? "Email address" : "Phone number",
          "new",
        ]}
      />
      <Form
        onSubmit={async () => {
          await addIdentity(identity);
        }}
      >
        <p>
          {type === IdentityTypes.PHONE ? "phone number" : "email address"} *
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
      <Button
        variant={ButtonVariant.SECONDARY}
        onClick={() => router.push("/account/logins/")}
      >
        Cancel
      </Button>
    </Container>
  );
};
