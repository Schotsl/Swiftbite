const { getSentryExpoConfig } = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname);

// This is a hotfix for Supabase but can be removed in a bit once the new release hits
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
