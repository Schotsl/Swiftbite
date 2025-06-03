import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://3a4dbc063d9900ef00a7307ccf28f2cb@o4505897577414656.ingest.us.sentry.io/4509433363431424",
  debug: false,
  enabled: process.env.NODE_ENV === "production",
  tracesSampleRate: 1,
});
