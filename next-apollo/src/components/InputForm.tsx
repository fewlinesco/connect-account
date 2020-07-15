import React from "react";

import { IdentityTypes } from "../graphql/@types/Identity";

type InputForm = {
  apiUrl: RequestInfo;
  type: IdentityTypes;
};

const InputForm: React.FC<InputForm> = ({ apiUrl, type }) => {
  const [formValue, setFormValue] = React.useState("");

  return (
    <form>
      <label>
        Value:
        <input
          type="text"
          name="value"
          value={formValue}
          onChange={(event) => setFormValue(event.target.value)}
        />
      </label>
      <input
        type="submit"
        value="Send"
        onClick={() => {
          const requestData = {
            userId: "5b5fe222-3070-4169-8f24-51b587b2dbc5",
            type,
            value: formValue,
          };

          fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });
        }}
      />
    </form>
  );
};

export default InputForm;
