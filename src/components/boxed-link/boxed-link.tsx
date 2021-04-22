import styled from "styled-components";

import { NeutralLink } from "../neutral-link/neutral-link";

const BoxedLink = styled(NeutralLink)<{
  disableClick?: boolean;
}>`
  height: 7.2rem;
  padding: 0 ${({ theme }) => theme.spaces.xs};
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({ disableClick }) => disableClick && `cursor: default;`}
`;

export { BoxedLink };
