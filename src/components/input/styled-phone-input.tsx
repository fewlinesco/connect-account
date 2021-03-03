import PhoneInput from "react-phone-number-input";
import styled from "styled-components";

const StyledPhoneInput = styled(PhoneInput)`
  margin: ${({ theme }) => theme.spaces.xs} 0;

  .PhoneInputInput {
    width: 100%;
    height: 4rem;
    padding-left: 1.6rem;
    border: 0.1rem solid ${({ theme }) => theme.colors.blacks[2]};
    border-radius: ${({ theme }) => theme.radii[0]};

    ::placeholder {
      color: ${({ theme }) => theme.colors.lightGrey};
      font-size: ${({ theme }) => theme.fontSizes.s};
    }
  }
`;

export { StyledPhoneInput };
