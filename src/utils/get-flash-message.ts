import Cookie from "js-cookie";

function getFlashMessage(): string | void {
  const flashMessage = Cookie.get("flashMessage");

  if (flashMessage) {
    Cookie.remove("flashMessage");
    return flashMessage;
  }
}

export { getFlashMessage };
