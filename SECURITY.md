Security posture (short term)

- Node version: Use Node 20 LTS (see `.nvmrc` and `"engines"`).
- Runtime CVEs addressed: Upgraded `axios` (1.x), `apexcharts` (>=3.24), and added overrides (`sweetalert2`, `tough-cookie`).
- Build validated: `npm run build` passes.

Audit commands

- CI gate (prod deps only): `npm run audit:ci`
  - Runs `npm audit --omit=dev --audit-level=critical` to fail only on critical runtime issues.
- Full audit (all deps): `npm run audit:full`
  - Runs `npm audit --audit-level=moderate` and will report dev‑toolchain issues as well.

Known risks (to be addressed next)

- ag-grid community/enterprise (prototype pollution): requires major upgrade to v34.x along with code updates.
- Vue 2.x ReDoS advisory: migrating to Vue 2.7 native composition API (or Vue 3) removes dependency on `@vue/composition-api` and unlocks further updates.
- Webpack/postcss dev‑chain advisories: largely resolved by migrating to Vue CLI 5 (webpack 5) or Vite.

Operational guidance

- Ensure CI/CD uses Node 20.x for builds and audits.
- Prefer `npm ci` for reproducible installs in CI.
- Treat `audit:full` findings as backlog items; prioritize ag-grid, CLI/toolchain, and Vue migration.
