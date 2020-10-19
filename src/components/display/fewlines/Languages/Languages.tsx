import React from "react";

import { H1 } from "../H1/H1";
import { Input } from "../Input/Input";

export const Languages: React.FC = () => {
  return (
    <div>
      <H1>Switch Language</H1>
      <Input />
      <div>
        <label>English</label>
        <input type="radio" name="language" value="english" />
      </div>
      <div>
        <label>French</label>
        <input type="radio" name="language" value="french" />
      </div>
    </div>
  );
};
