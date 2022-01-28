import { writeFileSync } from "fs";
import { spinner } from ".";

const saveCredentialsToEnv = (answers: {
  username: string;
  password: string;
}) => {
  try {
    writeFileSync(
      ".env",
      Object.entries<string>(answers)
        .map((answer) => answer.join("="))
        .join("\n")
    );
  } catch (error) {
    spinner.fail("An error occurred while saving your credentials.");
    process.exit(1);
  }
};

export { saveCredentialsToEnv };
