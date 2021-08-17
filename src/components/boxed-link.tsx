import styled from "styled-components";

import { NeutralLink } from "./neutral-link";

const BoxedLink = styled(NeutralLink)<{
  disableClick?: boolean;
}>`
  padding: ${({ theme }) => `${theme.spaces.xs} ${theme.spaces.xs}`};
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({ disableClick }) => disableClick && `cursor: default;`}
`;

export { BoxedLink };
