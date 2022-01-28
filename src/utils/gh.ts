import { execSync } from "child_process";

function checkAliasExist(alias: string): boolean {
  return !!execSync(`gh alias list | grep ${alias}`).toString();
}

export { checkAliasExist };
