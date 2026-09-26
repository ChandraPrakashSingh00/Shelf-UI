import packageJson from "../../../package.json";

/** Source code on GitHub, derived from `repository` in package.json. */
export const repositoryUrl = packageJson.repository.url.replace(/^git\+/, "").replace(/\.git$/, "");

export const issuesUrl = packageJson.bugs.url;

export const licenseUrl = `${repositoryUrl}/blob/main/LICENSE`;
