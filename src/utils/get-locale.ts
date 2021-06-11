const AVAILABLE_LANGUAGE: { [key: string]: string; en: string; fr: string } = {
  en: "English",
  fr: "Français",
};

function getLocaleKey(value: string): string {
  return (
    Object.keys(AVAILABLE_LANGUAGE).find(
      (key) => AVAILABLE_LANGUAGE[key] === value,
    ) || "en"
  );
}

export { AVAILABLE_LANGUAGE, getLocaleKey };
