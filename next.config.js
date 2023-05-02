/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    TEST_API: process.env.TEST_API,
    DEVELOPMENT_API: process.env.DEVELOPMENT_API,
    PRODUCTION_API: process.env.PRODUCTION_API,
    TEST_URL_APP: process.env.TEST_URL_APP,
    DEVELOPMENT_URL_APP: process.env.NEXTAUTH_URL,
    PRODUCTION_URL_APP: process.env.PRODUCTION_URL_APP,
    PAGINATION_LIMIT: process.env.PAGINATION_LIMIT,
    PAGINATION_OFFSET: process.env.PAGINATION_OFFSET,
    REGION: process.env.REGION,
    IDENTITY_POOL_ID: process.env.IDENTITY_POOL_ID,
    BUCKET_NAME: process.env.BUCKET_NAME,
    FOLDER_NAME: process.env.FOLDER_NAME,
    BUCKET_URL: process.env.BUCKET_URL,
    SECRET: process.env.SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
  },
  images: {
    domains: [
      "tallstrike.s3.eu-west-2.amazonaws.com",
      "encrypted-tbn0.gstatic.com",
      "res.cloudinary.com",
    ],
  },
};

module.exports = nextConfig;
