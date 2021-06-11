import styled from "styled-components";

const FormErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.red};
  margin-bottom: 3rem;
`;

export { FormErrorMessage };
