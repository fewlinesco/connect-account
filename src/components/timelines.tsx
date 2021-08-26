import React from "react";

const Timeline: React.FC = () => {
  return (
    <TimeLineContainer>
      <TimelineBulletPoint />
      <VerticalLine />
    </TimeLineContainer>
  );
};

const TimelineEnd: React.FC = () => {
  return (
    <TimeLineContainer>
      <TimelineBulletPoint />
      <VerticalLine />
      <svg
        width="8"
        height="8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mt-3"
      >
        <circle cx="4" cy="4" r="4" fill="#fff" stroke="#F0F1F3" />
      </svg>
    </TimeLineContainer>
  );
};

const TimeLineContainer: React.FC = ({ children }) => {
  return (
    <div className="absolute -left-4 md:hidden h-5/6 w-3 mt-2">{children}</div>
  );
};

const VerticalLine: React.FC = () => {
  return <div className="h-full border-r-2 border-separator mt-7 mr-1" />;
};

const TimelineBulletPoint: React.FC = () => {
  return (
    <svg
      width="8"
      height="8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mr-1"
    >
      <circle cx="4" cy="4" r="4" fill="#F0F1F3" />
    </svg>
  );
};

export { Timeline, TimelineEnd };
