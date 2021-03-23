// import { AlertMessage } from "@fwl/web";
// import React from "react";
// import { withReactContext } from "storybook-react-context";

// import { AlertMessageProvider } from "../react-contexts/alert-messages-context";
// import { AlertMessages } from "./alert-messages";
// import { generateAlertMessage } from "@src/utils/generateAlertMessage";

// type UseState = [
//   AlertMessage[],
//   React.Dispatch<React.SetStateAction<AlertMessage[]>>,
// ];

// function AlertMessageJSX(
//   value: AlertMessage,
//   dispatch: React.Dispatch<React.SetStateAction<AlertMessage[]>>,
// ): JSX.Element {
//   return (
//     <AlertMessageProvider>
//       <AlertMessages />
//       <button onClick={() => dispatch([value])}>
//         Click to trigger an alert message
//       </button>
//     </AlertMessageProvider>
//   );
// }

// const EmailValidationAlertMessage = (
//   _: unknown,
//   { context: [_state, dispatch] }: { context: UseState },
// ): JSX.Element =>
//   AlertMessageJSX(
//     generateAlertMessage("Confirmation email has been sent"),
//     dispatch,
//   );

// const PhoneValidationAlertMessage = (
//   _: unknown,
//   { context: [_state, dispatch] }: { context: UseState },
// ): JSX.Element =>
//   AlertMessageJSX(
//     generateAlertMessage("Confirmation SMS has been sent"),
//     dispatch,
//   );

// const EmailDeleteAlertMessage = (
//   _: unknown,
//   { context: [_state, dispatch] }: { context: UseState },
// ): JSX.Element =>
//   AlertMessageJSX(generateAlertMessage("Email has been deleted"), dispatch);

// const PhoneDeleteAlertMessage = (
//   _: unknown,
//   { context: [_state, dispatch] }: { context: UseState },
// ): JSX.Element =>
//   AlertMessageJSX(
//     generateAlertMessage("Phone number has been deleted"),
//     dispatch,
//   );

// export {
//   EmailValidationAlertMessage,
//   PhoneValidationAlertMessage,
//   EmailDeleteAlertMessage,
//   PhoneDeleteAlertMessage,
// };

// export default {
//   title: "components/Alert Messages",
//   component: AlertMessages,
//   decorators: [withReactContext],
// };

export {};
