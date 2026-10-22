import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

process.chdir(fileURLToPath(new URL("../", import.meta.url)));
const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  throw new Error(
    "Usage: pnpm release <version>, for example: pnpm release 0.2.0",
  );
}
if (
  execFileSync("git", ["status", "--porcelain"], { encoding: "utf8" }).trim()
) {
  throw new Error("Commit or stash your changes before preparing a release.");
}
const run = (command, args) =>
  execFileSync(command, args, { stdio: "inherit" });
run("pnpm", ["check"]);
run("pnpm", ["build"]);
run("pnpm", ["verify:package"]);
run("npm", ["version", version, "--no-git-tag-version"]);
run("pnpm", ["install", "--lockfile-only"]);
console.log(
  `Prepared ${version}. Update CHANGELOG.md, review and commit the changes, then push a v${version} tag to publish.`,
);
