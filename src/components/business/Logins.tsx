import React, { Dispatch, SetStateAction } from "react";

import { Identity } from "@src/@types/Identity";
import { SortedIdentities } from "@src/@types/SortedIdentities";

interface AddIdentityProps {
  sortedIdentities: SortedIdentities;
  children: (props: {
    setHideSecondaryEmails: Dispatch<SetStateAction<boolean>>;
    setHideSecondaryPhones: Dispatch<SetStateAction<boolean>>;
    emailList: Identity[];
    phoneList: Identity[];
    emailIdentities: Identity[];
    phoneIdentities: Identity[];
    hideSecondaryEmails: boolean;
    hideSecondaryPhones: boolean;
  }) => JSX.Element;
}

export const Logins: React.FC<AddIdentityProps> = ({
  sortedIdentities,
  children,
}) => {
  const [hideSecondaryEmails, setHideSecondaryEmails] = React.useState<boolean>(
    true,
  );
  const [hideSecondaryPhones, setHideSecondaryPhones] = React.useState<boolean>(
    true,
  );

  let emailList: Identity[];
  let phoneList: Identity[];

  hideSecondaryEmails
    ? (emailList = sortedIdentities.emailIdentities.filter(
        (identity) => identity.primary,
      ))
    : (emailList = sortedIdentities.emailIdentities);

  hideSecondaryPhones
    ? (phoneList = sortedIdentities.phoneIdentities.filter(
        (identity) => identity.primary,
      ))
    : (phoneList = sortedIdentities.phoneIdentities);

  const { emailIdentities, phoneIdentities } = sortedIdentities;

  return children({
    setHideSecondaryEmails,
    setHideSecondaryPhones,
    emailList,
    phoneList,
    emailIdentities,
    phoneIdentities,
    hideSecondaryEmails,
    hideSecondaryPhones,
  });
};
