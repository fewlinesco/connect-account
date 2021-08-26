import React from "react";

import classes from "./input-radio-button.module.css";
import { Separator } from "@src/components/separator";
import { SkeletonTextLine } from "@src/components/skeletons/skeletons";

const InputsRadio: React.FC<{
  groupName: string;
  inputsValues: string[];
  selectedInput: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isReady: boolean;
}> = ({ groupName, inputsValues, selectedInput, onChange, isReady }) => {
  return (
    <div role="radiogroup" aria-label={groupName}>
      {isReady ? (
        inputsValues.map((inputValue) => {
          return (
            <React.Fragment key={groupName + inputValue}>
              <label
                className="relative flex justify-between items-center bg-background shadow-box py-10 px-8 cursor-pointer leading-10"
                htmlFor={groupName + inputValue}
              >
                <p className="w-11/12 whitespace-nowrap overflow-hidden overflow-ellipsis">
                  {inputValue}
                </p>
                <input
                  className="sr-only"
                  type="radio"
                  id={groupName + inputValue}
                  name={groupName}
                  onChange={onChange}
                  value={inputValue}
                  checked={selectedInput === inputValue ? true : false}
                />
                <span
                  className={
                    "relative h-8 w-8 bg-background rounded-full border-2 border-black " +
                    classes.disguisedSpan
                  }
                />
              </label>
              <Separator />
            </React.Fragment>
          );
        })
      ) : (
        <label className="relative flex justify-between items-center bg-background shadow-box py-10 px-8 cursor-pointer leading-10">
          <SkeletonTextLine fontSize={1.6} width={50} />
        </label>
      )}
    </div>
  );
};

export { InputsRadio };
