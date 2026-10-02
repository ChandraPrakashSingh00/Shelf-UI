import packageJson from "../../../package.json";

/** Source code on GitHub, derived from `repository` in package.json. */
export const repositoryUrl = packageJson.repository.url.replace(/^git\+/, "").replace(/\.git$/, "");

export const issuesUrl = packageJson.bugs.url;

export const licenseUrl = `${repositoryUrl}/blob/main/LICENSE`;

export const npmUrl = `https://www.npmjs.com/package/${packageJson.name}`;

export const packageName = packageJson.name;

export const version = packageJson.version;

/** CodeCPS Technologies' company website, which hosts the legal pages. */
export const companyUrl = "https://www.codecpstechnologies.in";

export const privacyUrl = `${companyUrl}/privacy`;

export const termsUrl = `${companyUrl}/terms`;

export const contactEmail = "codecpstechnologies@gmail.com";

/** Official profiles only; add more here once they exist. */
export const instagramUrl = "https://www.instagram.com/codecpstechnologies/";
