import { withSentryConfig } from "@sentry/nextjs";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default withSentryConfig(nextConfig, {
  org: "sjors-van-holst-0c97a3b77",
  silent: !process.env.CI,
  project: "swiftbite-next",
  tunnelRoute: "/monitoring",
  disableLogger: true,
  widenClientFileUpload: true,
  automaticVercelMonitors: true,
});
