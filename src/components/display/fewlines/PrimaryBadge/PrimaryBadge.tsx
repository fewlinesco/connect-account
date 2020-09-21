import styled from "styled-components";

export const PrimaryBadge = styled.div`
  background: ${({ theme }) => theme.colors.primaryBadge};
  border-radius: ${({ theme }) => theme.radii[2]};
  height: 2.4rem;
  color: ${({ theme }) => theme.colors.backgroundContrast};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 9.4rem;
  margin-bottom: 1.5rem;

  p {
    font-size: ${({ theme }) => theme.fontSizes.xs};
    margin-right: 0.3rem;
  }
`;
