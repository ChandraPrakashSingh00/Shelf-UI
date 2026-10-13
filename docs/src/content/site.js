import packageJson from "../../../package.json";

/** The library's name; the npm package is `packageName`. */
export const productName = "Shelf UI";

/** Source code on GitHub, derived from `repository` in package.json. */
export const repositoryUrl = packageJson.repository.url.replace(/^git\+/, "").replace(/\.git$/, "");

export const issuesUrl = packageJson.bugs.url;

export const releasesUrl = `${repositoryUrl}/releases`;

export const licenseUrl = `${repositoryUrl}/blob/main/LICENSE`;

export const npmUrl = `https://www.npmjs.com/package/${packageJson.name}`;

export const packageName = packageJson.name;

export const version = packageJson.version;
