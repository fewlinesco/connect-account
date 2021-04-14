import React from "react";
import styled from "styled-components";

const LoginsSkeleton: React.FC = () => {
  return (
    <SkeletonBody>
      <SkeletonLine />
      <SkeletonBlock />
      <SkeletonLine />
      <SkeletonBlock />
    </SkeletonBody>
  );
};

const IdentityOverviewSkeleton: React.FC = () => {
  return (
    <SkeletonBody>
      <SkeletonBlock />
      <SkeletonLine />
    </SkeletonBody>
  );
};

const UpdateIdentitySkeleton: React.FC = () => {
  return (
    <SkeletonBody>
      <SkeletonSection />
      <SkeletonBlock />
      <SkeletonLine />
    </SkeletonBody>
  );
};

const SecuritySkeleton: React.FC = () => {
  return (
    <SkeletonBody>
      <SkeletonSection />
    </SkeletonBody>
  );
};

const TwoFASkeleton: React.FC = () => {
  return (
    <SkeletonBody>
      <SkeletonBlock />
    </SkeletonBody>
  );
};

const BreadcrumbsSkeleton: React.FC = () => {
  return (
    <SkeletonBody>
      <SkeletonTextLine fontSize={1.4} />
    </SkeletonBody>
  );
};

const SkeletonBody = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  height: auto;
  width: auto;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii[1]};

  @keyframes loading {
    100% {
      transform: translateX(100%);
    }
  }
`;

const SkeletonAnimation = styled.div`
  &&::after {
    display: block;
    content: "";
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    transform: translateX(-100%);
    background: linear-gradient(
      90deg,
      transparent,
      rgba(222, 222, 222, 0.6),
      transparent
    );
    animation: loading 1.5s infinite;
  }
`;

const SkeletonLine = styled(SkeletonAnimation)`
  border-radius: ${({ theme }) => theme.radii[1]};
  padding: 2rem 0;
  position: relative;
  background-color: #e2e2e2;
  margin-bottom: 2rem;
`;

const SkeletonTextLine = styled(SkeletonAnimation)<{ fontSize: number }>`
  position: relative;
  height: ${({ fontSize }) => `${fontSize}rem`};
  width: 50%;
  background-color: ${({ theme }) => theme.colors.box};
  border-radius: ${({ theme }) => theme.radii[0]};
  overflow: hidden;

  @keyframes loading {
    100% {
      transform: translateX(100%);
    }
  }
`;

const SkeletonBlock = styled(SkeletonAnimation)`
  border-radius: ${({ theme }) => theme.radii[1]};
  padding: 8rem 0;
  position: relative;
  background-color: #e2e2e2;
  margin-bottom: 5rem;
`;

const SkeletonSection = styled(SkeletonAnimation)`
  border-radius: ${({ theme }) => theme.radii[1]};
  padding: 3.4rem 0;
  position: relative;
  background-color: #e2e2e2;
  margin-bottom: 5rem;
`;

export {
  LoginsSkeleton,
  IdentityOverviewSkeleton,
  UpdateIdentitySkeleton,
  SecuritySkeleton,
  TwoFASkeleton,
  BreadcrumbsSkeleton,
  SkeletonTextLine,
};
