# WIWW V76 — GitHub source export

This is the actual WIWW application source from saved Sites version76, commit `b866992e6a6c4e18ea1a93113aa847d33b874c56`, including the Master Standard overwrite. It is not a mockup or a compiled-only website.

## Put it in GitHub

1. Create an empty **private** GitHub repository. Do not initialize it with a README.
2. Unzip this package and open its inner `WIWW-V76-GitHub` directory.
3. From that directory run the commands below. Substitute your repository URL.

```bash
git init
git add .
git commit -m "Import WIWW V76 source"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

`git add .` includes the existing `.openai` manifest and other needed configuration files. Avoid uploading the ZIP itself as your source repository. For GitHub's web upload, upload the contents of the inner directory, preserving subdirectories and hidden configuration files.

## Local development

Use Node.js22.13.0 or newer and the package-manager version declared in package.json (pnpm11.25.0).

```bash
corepack enable
corepack prepare pnpm@11.25.0 --activate
pnpm install --frozen-lockfile
pnpm dev
```

Open the loopback URL printed by the development server. The portable development profile starts at port5173. The public interface can render without populated local data; successful intake, owner tools and customer records require local D1 schema initialization and appropriate environment settings.

Apply the17 SQL files in `drizzle/` in filename order (0000 through0016), to a **fresh local** database. After `pnpm build`, an individual local command is:

```bash
pnpm exec wrangler d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_panoramic_scarlet_witch.sql
```

Repeat for each subsequent SQL file in order. Do not replay these files over an existing initialized database or use production data for local testing. No production database or customer records are included.

Copy `.dev.vars.example` to ignored `.dev.vars` when configuring Cloudflare local development. Generate your own64-character hexadecimal CARE_PLAN_LINK_KEY using `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Keep the resulting value outside Git. Production values belong in the hosting provider's protected environment settings. The local mock sign-in is described in README.md; it is limited to portable loopback development.

## Checks and build

```bash
pnpm exec tsc --noEmit
pnpm exec eslint . --ignore-pattern dist --ignore-pattern .next --max-warnings 0
pnpm build
```

The18 executable regression scripts are in `tests/`; `promotion-loader.mjs` is their loader. To run one:

```bash
node --experimental-strip-types --loader ./tests/promotion-loader.mjs tests/master-standard-selector.mjs
```

Run each test `.mjs` except the loader. The supplied test-results.json records checks executed against V76; it does not mean the tests have run on your computer.

## Hosting and protected systems

This is a Vinext/React application targeting Cloudflare Workers, using D1 and R2. **GitHub Pages cannot run its backend.** Uploading source to GitHub does not publish or move the existing WIWW website.

The original Sites identity is retained in `.openai/hosting.json` (a non-secret project ID). The source still contains Sites-specific authentication and integration code. Independent hosting requires equivalent trusted identity handling, owner authorization, DB/BUCKET bindings, SITE_ORIGIN, OWNER_EMAIL, CARE_PLAN_LINK_KEY and any supported notification/integration settings. Do not trust identity headers supplied directly by arbitrary visitors.

Existing accepted quotes and customer data must be migrated separately through a controlled process if hosting ever changes. Do not replace live databases with this source package or a local test database. No deployment workflow or automatic publication has been added.

## What is included

- Application source, server routes and business configuration.
- Approved public artwork and media.
- Dependency manifest and lockfile; required `build/` plugin source (this directory is source, not compiled output).
- D1 migration SQL, schemas and regression tests.
- Latest implementation report and test exit inventory.

Runtime secrets, local databases, node_modules, compiled dist, Git history and historical QA captures/logs are excluded. `.gitignore` has export-only additions to exclude local secret files and permit safe example files. `SOURCE-VERSION.json` lists the originating commit and hashes of the retained original files. Application source files were not modified for this export.
