# PPH Frontend — Angular 19

## Prerequisites

- Node.js 20 LTS
- npm 10+

## Setup

```sh
npm install
```

## Development Server

```sh
npm start
# App runs at http://localhost:4200
```

## Build

```sh
npm run build        # development
npm run build -- --configuration production  # production
```

## Tests

```sh
npm test             # Jest unit tests (watch mode)
npm run test -- --watchAll=false  # single run
npm run e2e          # Playwright end-to-end
npm run typecheck    # TypeScript type-check without emit
npm run lint         # ESLint
```

## Regenerating the API Client

The Angular API client in `src/app/core/api/` is generated from the backend OpenAPI spec using `@openapitools/openapi-generator-cli`.

### Prerequisites

- The backend must be running locally: `./gradlew :backend:bootRun`
- The OpenAPI spec is served at `http://localhost:8080/api/v1/openapi.json`

### Regenerate

```sh
# With backend running
npm run generate:api

# In CI (skips spec validation)
npm run generate:api:ci
```

The generator is configured in [`openapi-generator.json`](./openapi-generator.json). Files listed in [`.openapi-generator-ignore`](./.openapi-generator-ignore) will not be overwritten.

After regeneration, review the diff for any breaking changes to model or service signatures, then commit the updated files.

## Environment Configuration

| File | Purpose |
|------|---------|
| `src/environments/environment.ts` | Development (default) |
| `src/environments/environment.production.ts` | Production (injected at build) |

Production placeholders (`__API_URL__`, `__SENTRY_DSN__`) are replaced by the CI/CD pipeline.
