import styled from "styled-components";

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

export { SkeletonTextLine };
