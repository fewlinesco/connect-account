import React from "react";

import classes from "./skeleton.module.css";

const SkeletonTextLine: React.FC<{
  fontSize: 1.4 | 1.6;
  width: 40 | 50 | 75;
  responsive?: boolean;
}> = ({ fontSize, width, responsive }) => {
  let dynamicClassNames;

  if (fontSize === 1.4) {
    if (width === 40) {
      dynamicClassNames = "h-6 w-2/5";
    } else if (width === 50) {
      dynamicClassNames = "h-6 w-1/2";
    } else if (width === 75) {
      dynamicClassNames = "h-6 w-3/4";
    }
  } else if (fontSize === 1.6) {
    if (width === 40) {
      dynamicClassNames = "h-7 w-2/5";
    } else if (width === 50) {
      dynamicClassNames = `h-7 ${responsive ? "w-3/4 lg:w-1/2" : "w-1/2"}`;
    } else if (width === 75) {
      dynamicClassNames = "h-7 w-3/4";
    }
  }

  return (
    <div
      className={`relative bg-box rounded overflow-hidden ${dynamicClassNames} ${classes.skeletonAnimation}`}
    />
  );
};

export { SkeletonTextLine };
