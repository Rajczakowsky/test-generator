/* eslint-disable max-len */
const getEnv = require('@twigeducation/getenv');

module.exports = {
    ACCOUNTS_URL: '/accounts',
    AUTHENTICATION_URL: getEnv('AUTHENTICATION_URL', 'http://localhost:5001'),
    CREATE_GRAPHQL_URL_FROM_HOSTNAME: getEnv('CREATE_GRAPHQL_URL_FROM_HOSTNAME', false),
    ENABLE_REDUX_DEV_TOOLS: getEnv('ENABLE_REDUX_DEV_TOOLS', false),
    GOOGLE_ANALYTICS: getEnv('GOOGLE_ANALYTICS', false),
    GOOGLE_TAG_MANAGER: getEnv('GOOGLE_TAG_MANAGER', ''),
    LAUNCH_DARKLY_CLIENT_ID: getEnv('LAUNCH_DARKLY_CLIENT_ID', '5bfe88504011dd4b1fb59c7e'), // Fallback value is test environment
    LOGIN_URL: '/login',
    PRODUCT_NAME: getEnv('PRODUCT_NAME', 'tsc'),
    PUBLIC_GRAPHQL_URL: getEnv('PUBLIC_GRAPHQL_URL', 'http://localhost:3001/graphql'),
    FFF_SENTRY_PUBLIC_DSN: getEnv('FFF_SENTRY_PUBLIC_DSN', null),
};
