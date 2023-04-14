// This function receives an enrironment key and returns the corresponding api url
const apiUrl = (envKey: any) => {
  const API_URL: Record<string, any> = {
    test: process.env.TEST_API,
    development:
      process.env.DEVELOPMENT_API || "http://api.talstrike.com/api/v1/",
    production: process.env.PRODUCTION_API,
    preview: process.env.DEVELOPMENT_API,
  };
  let key = (envKey as string).toLowerCase();
  return API_URL[key];
};

// This function receives an enrironment key and returns the corresponding application url
// The application url is the domain name for tallstrike
const applicationUrl = (envKey: any) => {
  if (!envKey) {
    return process.env.NEXTAUTH_URL;
  }
  const APPLICATION_URL: Record<string, any> = {
    test: process.env.TEST_URL_APP,
    development: process.env.DEVELOPMENT_URL_APP,
    production: process.env.PRODUCTION_URL_APP,
    preview: process.env.DEVELOPMENT_URL_APP,
  };
  let key = (envKey as string).toLowerCase();
  return APPLICATION_URL[key];
};

const talstrikeConfig = (envKey: any) => {
  const TALSTRIKE_CONFIG: Record<string, any> = {
    filter_count_limit: process.env.FILTER_COUNT_LIMIT,
    see_less_text: process.env.SEE_LESS_TEXT,
    see_all_text: process.env.SEE_ALL_TEXT,
    pagination_offset: process.env.PAGINATION_OFFSET,
    pagination_limit: process.env.PAGINATION_LIMIT,
    secret: "9e1cd88ca64e7d2fa5ba1eeea0aab4cd",
    nextauth_secret: process.env.NEXTAUTH_SECRET,
  };
  return TALSTRIKE_CONFIG[(envKey as string).toLowerCase()];
};

const config = {
  API_URL: apiUrl(process.env.NODE_ENV),
  APPLICATION_URL: applicationUrl(process.env.NODE_ENV),
  TALSTRIKE_CONFIG: talstrikeConfig(process.env.NODE_ENV),
  SECRET: talstrikeConfig("SECRET"),
  NEXTAUTH_SECRET: talstrikeConfig("NEXTAUTH_SECRET"),
};

export default config;
