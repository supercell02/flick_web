import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: "https://able-manatee-31.clerk.accounts.dev",
      applicationID: "convex",
    },
  ]
} satisfies AuthConfig;