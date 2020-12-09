import Cookie from "js-cookie";

export function getFlashMessage(): string | void {
  const flashMessage = Cookie.get("flashMessage");

  if (flashMessage) {
    Cookie.remove("flashMessage");
    return flashMessage;
  }
}
