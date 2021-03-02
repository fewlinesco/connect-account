import styled from "styled-components";

const WrongInputError = styled.p`
  color: ${({ theme }) => theme.colors.red};
  margin-bottom: 3rem;
`;

export { WrongInputError };
