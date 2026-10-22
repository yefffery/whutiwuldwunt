import type { Plugin } from "vite";

export interface SitesPluginOptions {
  /** Dev-only mock owner sign-in for portable local previews. */
  mockAuth?: boolean;
}

/**
 * Site wiring for the local preview. The canonical configuration now lives in
 * src/config/business_configuration.json and is imported directly by the app,
 * so the plugin itself only needs to carry dev-only behavior flags.
 */
export function sites(options: SitesPluginOptions = {}): Plugin[] {
  return [
    {
      name: "sites",
      apply: "serve",
      config() {
        return {
          define: {
            __SITES_MOCK_AUTH__: JSON.stringify(!!options.mockAuth),
          },
        };
      },
    },
  ];
}
