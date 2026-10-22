import handler from "vinext/server/fetch-handler";

// The Cloudflare worker entry for the Sites app: vinext resolves the App
// Router handler for this project at build time.
export default {
  fetch: (request, env, ctx) => handler.fetch(request, env, ctx),
};
