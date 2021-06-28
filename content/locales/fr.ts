export const fr = {
  "/": {
    info: "Vous êtes sur le point d’accéder à votre compte depuis",
    callToAction: "Accéder à mon compte",
  },
  "/account": {
    breadcrumb: "Bienvenue sur votre compte",
    createProfileTitle: "CRÉER VOTRE PROFIL",
    updateProfileTitle: "INFORMATIONS PERSONNELLES",
    loginsTitle: "IDENTIFIANTS",
    securityTitle: "SÉCURITÉ",
    createProfile:
      "Ajoutez vos informations personnelles, comme votre nom ou vos adresses.",
    updateProfile:
      "Mettez à jour vos informations personnelles, comme votre nom ou vos adresses.",
    logins:
      "Gérez vos options de connexion, y compris les courriels, les numéros de téléphone et les réseaux sociaux",
    security:
      "Définissez ou modifiez votre mot de passe. Vous pouvez consulter l’historique de vos connexions ici.",
  },
  "/account/profile": {
    title: "Informations personnelles",
    breadcrumb: "Renseignements personnels vous concernant",
    profileSection: "Profil",
    profilePicture: "PHOTO DE PROFIL",
    name: "NOM",
    preferredName: "NOM D’UTILISATEUR PRÉFÉRÉ",
    birthDate: "DATE DE NAISSANCE",
    timeZone: "FUSEAU HORAIRE",
    locale: "LANGUE",
    website: "SITE WEB",
    profile: "PROFIL",
    updateInfo: "Mettre à jour vos informations personnelles",
    addressesSection: "Adresses",
    addAddress: "Ajouter une nouvelle adresse",
    noAddresses: "Aucune adresse n’a encore été ajoutée",
    showMore: "Afficher plus",
    hide: "Cacher",
  },
  "/account/profile/user-profile/new": {
    title: "Informations personnelles",
    breadcrumb: "Profil | création",
    info: "Veuillez remplir ces informations pour créer votre profil.",
  },
  "/account/profile/user-profile/edit": {
    title: "Informations personnelles",
    breadcrumb: "Profil | modification",
  },
  "/account/profile/addresses/[id]": {
    title: "Informations personnelles",
    breadcrumb: "Adresse | modification",
  },
  "/account/profile/addresses/new": {
    title: "Personal information",
    breadcrumb: "Address | création",
  },
  "/account/logins": {
    title: "Identifiants",
    breadcrumb: "Vos e-mails, téléphones et identifiants de réseaux sociaux",
    emailTitle: "Adresses e-mail",
    emailNoIdentityMessage: "Aucun e-mail n’a encore été ajouté.",
    emailAddNewIdentityMessage: "Ajouter une nouvelle adresse e-mail",
    phoneTitle: "Numéros de téléphone",
    phoneNoIdentityMessage: "Aucun numéro de téléphone ajouté.",
    phoneAddNewIdentityMessage: "Ajouter un nouveau numéro de téléphone",
    socialTitle: "Comptes de réseaux sociaux",
    socialNoIdentityMessage:
      "Aucun compte de réseau social n’a encore été ajouté",
    showMore: "Afficher plus",
    hide: "Cacher",
  },
  "/account/logins/[type]/new": {
    title: "Identifiants",
    emailBreadcrumb: "Adresses e-mail",
    phoneBreadcrumb: "Numéro de téléphone",
  },
  "/account/logins/[type]/[id]": {
    title: "Identifiants",
    emailBreadcrumb: "Adresses e-mail",
    phoneBreadcrumb: "Numéro de téléphone",
  },
  "/account/logins/[type]/[id]/update": {
    title: "Identifiants",
    emailBreadcrumb: "Adresses e-mail | modification",
    phoneBreadcrumb: "Numéro de téléphone | modification",
  },
  "/account/logins/[type]/validation/[eventId]": {
    title: "Identifiants",
    emailBreadcrumb: "Adresses e-mail | validation",
    phoneBreadcrumb: "Numéro de téléphone | validation",
  },
  "/account/security": {
    title: "Sécurité",
    sectionTitle: "Mot de passe",
    breadcrumb: "Mot de passe, historique de connexion et plus",
    setPassword: "Créer votre mot de passe",
    updatePassword: "Mettre à jour votre mot de passe",
  },
  "/account/security/update": {
    title: "Mot de passe",
    setBreadcrumb: "Mot de passe | création",
    updateBreadcrumb: "Mot de passe | mettre à jour",
    set: "créer",
    update: "mettre à jour",
  },
  "/account/security/sudo": {
    title: "Sécurité",
    warning:
      "Vous avez besoin d’une authentification à double facteur pour accéder à cette page",
    info: "Choisissez un moyen de contact sur lequel nous enverrons un code de validation:",
    send: "Envoi du code de validation",
    resend: "Renvoyer le code de validation",
    twoFALabel: "Entrez le code reçu ici :",
    confirm: "Confirmer",
  },
  "/account/locale": {
    title: "Changer de langue",
  },
  alertMessages: {
    localeChanged: "Votre langue a été réglée sur",
    confirmationCodeEmail: "Un e-mail de confirmation a été envoyé",
    confirmationCodePhone: "Un SMS de confirmation a été envoyé",
    newConfirmationCodeEmail: "Un nouvel e-mail de confirmation a été envoyé",
    newConfirmationCodePhone: "Un nouveau SMS de confirmation a été envoyé",
    validationCodeExpired: "Le code de validation a expiré",
    emailUpdated: "Votre address e-mail a été mise à jour",
    phoneUpdated: "Votre numéro de téléphone a été mis à jour",
    emailAdded: "Votre adresse e-mail a été ajoutée",
    phoneAdded: "Votre numéro de téléphone a été ajouté",
    emailDeleted: "Votre adresse e-mail a été supprimée",
    phoneDeleted: "Votre numéro de téléphone a été supprimé",
    emailMarkedAsPrimary: "est maintenant votre e-mail principal",
    phoneMarkedAsPrimary: "est maintenant votre numéro de téléphone principal",
    addressAdded: "Votre adresse a été ajoutée",
    addressUpdated: "Votre adresse a été mise à jour",
    addressDeleted: "Votre adresse a été supprimée",
    addressMarkedAsPrimary: "Votre adresse a été marquée comme principale",
    profileCreated: "Votre profil à été créé",
    profileUpdated: "Votre profil a été mis à jour",
  },
  navigation: {
    home: "Accueil",
    logins: "Identifiants",
    security: "Sécurité",
    createYourProfile: "Créer votre profil",
    personalInformation: "Informations personnelles",
    language: "Langue",
    menu: "Menu",
    back: "Retour",
    close: "Fermer",
    logout: "Vous déconnecter",
  },
  errors: {
    "404Title": "Nous ne trouvons pas la page que vous cherchez.",
    "404Content":
      "Elle peut être expirée, ou il pourrait y avoir une coquille. Peut-être que vous pouvez trouver ce dont vous avez besoin sur notre",
    homepage: "page d'acceuil.",
    "500Content":
      "Quelque chose a mal tourné. Nous travaillons à régler ce problème le plus tôt possible.",
    blankPassword: "Le mot de passe ne peut pas être vide.",
    passwordMatch:
      "Votre confirmation de mot de passe ne correspond pas à votre nouveau mot de passe.",
    passwordCriteria:
      "Le mot de passe que vous entrez ne répond pas aux critères.",
    passwordInfo: "Assurez-vous que votre mot de passe contient au moins :",
    passwordRuleDigit:
      "{digitCount, plural, one {1 chiffre} other {{digitCount} chiffres}}",
    passwordRuleNonDigit:
      "{nonDigitCount, plural, one {1 non-chiffre} other {{nonDigitCount} non-chiffres}}",
    passwordRuleCharacter:
      "{characterCount, plural, one {1 caractère} other {{characterCount} caractères}}",
    somethingWrong:
      "Quelque chose s’est mal passé. Veuillez réessayer plus tard.",
    invalidValidationCode: "Code de validation invalide.",
  },
};
