export const en = {
  "/": {
    info: "You are about to access your account from",
    callToAction: "Access my account",
  },
  "/account": {
    breadcrumb: "Welcome to your account",
    createProfileTitle: "CREATE YOUR PROFILE",
    updateProfileTitle: "PERSONAL INFORMATION",
    loginsTitle: "LOGINS",
    securityTitle: "SECURITY",
    createProfile:
      "Add personal information about you, like your name, or addresses.",
    updateProfile:
      "Update personal information about you, like your name, or addresses.",
    logins:
      "Manage your logins options, including emails, phone numbers and social logins.",
    security:
      "Set or change your password. You can check your connections history here.",
  },
  "/account/profile": {
    title: "Personal information",
    breadcrumb: "Basic information about you",
    profileSection: "Profile",
    profilePicture: "PROFILE PICTURE",
    name: "NAME",
    preferredName: "PREFERRED USERNAME",
    birthDate: "BIRTH DATE",
    timeZone: "TIME ZONE",
    locale: "LOCALE",
    website: "WEBSITE",
    profile: "PROFILE",
    updateInfo: "Update your personal information",
    addressesSection: "Addresses",
    addAddress: "Add new address",
    noAddresses: "No addresses added yet",
    showMore: "Show more",
    hide: "Hide",
  },
  "/account/profile/user-profile/new": {
    title: "Personal information",
    breadcrumb: "Profile | new",
    info: "Please fill in these information to create your profile.",
  },
  "/account/profile/user-profile/edit": {
    title: "Personal information",
    breadcrumb: "Profile | edit",
  },
  "/account/profile/addresses/[id]": {
    title: "Personal information",
    breadcrumb: "Address",
  },
  "/account/profile/addresses/[id]/edit": {
    title: "Personal information",
    breadcrumb: "Address | edit",
  },
  "/account/profile/addresses/new": {
    title: "Personal information",
    breadcrumb: "Address | new",
  },
  "/account/logins": {
    title: "Logins",
    breadcrumb: "Your emails, phones and social logins",
    emailTitle: "Email addresses",
    emailNoIdentityMessage: "No email added yet.",
    emailAddNewIdentityMessage: "Add new email address",
    phoneTitle: "Phone numbers",
    phoneNoIdentityMessage: "No phone number added yet.",
    phoneAddNewIdentityMessage: "Add new phone number",
    socialTitle: "Social logins",
    socialNoIdentityMessage: "No social logins added yet.",
    showMore: "Show more",
    hide: "Hide",
  },
  "/account/logins/[type]/new": {
    title: "Logins",
    emailBreadcrumb: "Email address",
    phoneBreadcrumb: "Phone number",
  },
  "/account/logins/[type]/[id]": {
    title: "Logins",
    emailBreadcrumb: "Email address",
    phoneBreadcrumb: "Phone number",
  },
  "/account/logins/[type]/[id]/update": {
    title: "Logins",
    emailBreadcrumb: "Email address | edit",
    phoneBreadcrumb: "Phone number | edit",
  },
  "/account/logins/[type]/validation/[eventId]": {
    title: "Logins",
    emailBreadcrumb: "Email address | validation",
    phoneBreadcrumb: "Phone number | validation",
  },
  "/account/security": {
    title: "Security",
    sectionTitle: "Password",
    breadcrumb: "Password, login history and more",
    setPassword: "Set your password",
    updatePassword: "Update your password",
  },
  "/account/security/update": {
    title: "Password",
    setBreadcrumb: "Password | set",
    updateBreadcrumb: "Password | update",
    set: "set",
    update: "update",
  },
  "/account/security/sudo": {
    title: "Security",
    warning: "You need double factor authentication to access this page",
    info: "Choose a contact means below that we’ll send a validation code to:",
    send: "Send validation code",
    resend: "Resend validation code",
    twoFALabel: "Enter received code here:",
    confirm: "Confirm",
  },
  "/account/locale": {
    title: "Switch Language",
  },
  alertMessages: {
    localeChanged: "Your language has been set to",
    confirmationCodeEmail: "A confirmation email has been sent",
    confirmationCodePhone: "A confirmation SMS has been sent",
    newConfirmationCodeEmail: "A new confirmation email has been sent",
    newConfirmationCodePhone: "A new confirmation SMS has been sent",
    validationCodeExpired: "The validation code has expired",
    emailUpdated: "Your email address has been updated",
    phoneUpdated: "Your phone number has been updated",
    emailAdded: "Your email address has been added",
    phoneAdded: "Your phone number has been added",
    emailDeleted: "Your email address has been deleted",
    phoneDeleted: "Your phone number has been deleted",
    emailMarkedAsPrimary: "is now your primary email",
    phoneMarkedAsPrimary: "is now your primary phone number",
    addressAdded: "Your address has been added",
    addressUpdated: "Your address has been updated",
    addressDeleted: "Your address has been deleted",
    addressMarkedAsPrimary: "Your address has been marked as primary",
    profileCreated: "Your profile has been created",
    profileUpdated: "Your profile has been updated",
  },
  navigation: {
    home: "Home",
    logins: "Logins",
    security: "Security",
    createYourProfile: "Create Your Profile",
    personalInformation: "Personal Information",
    language: "Language",
    menu: "Menu",
    back: "Back",
    close: "Close",
    logout: "Logout",
  },
  errors: {
    "404Title": "We can't find the page you are looking for.",
    "404Content":
      "It may have expired, or there could be a typo. Maybe you can find what you need on our",
    homepage: "homepage",
    "500Content":
      "Something went wrong. We are working on getting this fixed as soon as we can.",
    blankPassword: "Password can't be blank.",
    passwordMatch:
      "Your password confirmation does not match your new password.",
    passwordCriteria: "The password you entered does not meet the criteria.",
    passwordInfo: "Ensure that your password contains at least:",
    passwordRuleDigit:
      "{digitCount, plural, one {1 digit} other {{digitCount} digits}}",
    passwordRuleNonDigit:
      "{nonDigitCount, plural, one {1 non-digit} other {{nonDigitCount} non-digits}}",
    passwordRuleCharacter:
      "{characterCount, plural, one {1 character} other {{characterCount} characters}}",
    somethingWrong: "Something went wrong. Please try again later.",
    invalidValidationCode: "Invalid validation code.",
    identityInputCantBeBlank: "Please fill in the following field:",
    invalidPhoneNumberInput: "Invalid phone number format.",
    invalidBody: "Something went wrong. Please try again later.",
    invalidIdentityType: "Invalid identity type.",
    invalidUserAddressPayload: "Please fill in the above field.",
  },
};
