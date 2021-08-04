const printStep = (step: string, title = false): void => {
  process.stdout.write(
    title
      ? `🤖\u001b[1m ${step.toUpperCase()}\u001b[0m\n`
      : `🤖\u001b[33m Test step:\u001b[0m\u001b[32m ${step}\u001b[0m\n`,
  );
};

export { printStep };
export { authenticateToConnect } from "./authenticate-to-connect";
export { getEmailValidationCode } from "./check-verification-code";
