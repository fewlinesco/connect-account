import styled from "styled-components";

export const AwaitingValidationBadge = styled.div`
  background: ${({ theme }) => theme.colors.red};
  border-radius: ${({ theme }) => theme.radii[2]};
  height: 2.4rem;
  color: ${({ theme }) => theme.colors.backgroundContrast};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 15.8rem;
  margin-bottom: 1rem;

  p {
    font-size: ${({ theme }) => theme.fontSizes.xs};
    margin-right: 0.3rem;
  }
`;
