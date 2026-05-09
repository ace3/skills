# JavaScript Web Static Scan

Use for whitebox security review of Next.js, Node.js, TypeScript, React, Express, Fastify, NestJS, GraphQL, and modern JavaScript web applications.

## Procedure

1. Identify the framework, router model, runtime targets, package manager, lockfiles, build scripts, server entry points, API routes, middleware, and deployment adapter.
2. Map trust boundaries before scanning: browser to server, server components to client components, middleware to route handlers, API routes to data stores, external callbacks, file uploads, cache layers, and build or release scripts.
3. Review Next.js App Router and Pages Router surfaces: `app/api`, `pages/api`, route handlers, middleware, server actions, `getServerSideProps`, `getStaticProps`, edge/runtime config, redirects, rewrites, image config, headers, and cache controls.
4. Review Node server surfaces: Express/Fastify/Nest middleware order, body parsers, route registration, validation, auth guards, CORS, proxy trust, sessions, cookies, upload handlers, static file serving, and error handlers.
5. Run only the smallest useful read-only scanner set, then confirm findings with code, config, lockfile, runtime relevance, or safe local tests.
6. Separate confirmed vulnerabilities, high-confidence actionable findings, false positives, and unconfirmed scanner leads.

## Framework Detection

- Next.js: `next.config.*`, `app/`, `pages/`, `middleware.*`, route handlers, server actions, `next-auth`, `next/font`, `next/image`, `output: "standalone"`, or Vercel config.
- Node API frameworks: `express`, `fastify`, `@nestjs/*`, `koa`, `hono`, `apollo-server`, `graphql-yoga`, `trpc`, or custom HTTP server entry points.
- TypeScript: `tsconfig.json`, path aliases, decorators, transpiler config, `strict` posture, generated clients, and runtime validation coverage.
- Package managers: `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `bun.lockb`, workspace config, monorepo package boundaries, and lifecycle scripts.

## Read-Only Tooling

- Prefer repo scripts and CI commands when they already run security checks.
- Semgrep: JavaScript, TypeScript, React, Next.js, Express, injection, XSS, SSRF, insecure crypto, and framework misuse patterns.
- CodeQL: deeper source/sink analysis when a database exists or can be built without broad mutation.
- `npm audit`, `pnpm audit`, `yarn npm audit`, or `bun audit`: dependency advisory evidence from the active lockfile.
- Trivy filesystem/config/image: dependency, Dockerfile, IaC, lockfile, and image-layer evidence.
- Gitleaks or TruffleHog: current-file or explicitly scoped history secret scans.
- Optional deepsec route: use only as an AI-assisted SAST aid. Do the free candidate scan before any paid or AI processing step, get explicit approval before cost-incurring processing, and treat results as leads until revalidated.

## Next.js Review Points

- Authentication and authorization: route handlers, middleware matchers, server actions, API routes, role checks, tenant/account scoping, callback validation, and alternate paths to protected resources.
- Client/server boundary: secrets imported into client components, accidental `NEXT_PUBLIC_*` exposure, server-only modules crossing client bundles, hydration data leakage, and sensitive props serialized into HTML.
- Server-side request paths: SSRF through fetch, image optimization, webhooks, redirects, URL parsers, metadata generation, Open Graph image generation, and proxy or passthrough routes.
- Cache and rendering: sensitive data cached by static generation, `revalidate`, route segment config, CDN headers, shared fetch cache, and user-specific responses missing private/no-store controls.
- Input handling: server actions, route handlers, search params, form data, JSON bodies, file uploads, path params, GraphQL variables, and validation tied to runtime schemas rather than TypeScript types alone.
- Browser security: XSS sinks, unsafe HTML rendering, script injection, CSP gaps, cookie attributes, CSRF protections, open redirects, CORS, and security headers.

## Node And API Review Points

- Middleware order: auth, CSRF, rate limit, CORS, body size limits, file upload parsing, static file serving, and error handling must run on the intended routes.
- Data access: SQL or ORM query construction, tenant filters, raw queries, NoSQL operators, Prisma/TypeORM/Sequelize use, migrations, and repository-level scoping.
- Sessions and tokens: cookie flags, JWT issuer/audience/expiry validation, refresh token rotation, logout invalidation, OAuth state/PKCE, password reset tokens, and service-to-service credentials.
- Outbound calls: SSRF guards, allowlists, redirect following, DNS rebinding risk, metadata service access, webhook signing, callback replay, and timeout/retry controls.
- File and process access: uploads, archives, path traversal, MIME validation, temporary files, command execution, template rendering, PDF/image processing, and dependency-based native binaries.
- Observability: secret logging, PII in client errors, stack traces, debug endpoints, source maps, and telemetry export keys.

## Node, Fastify, And TypeScript Deep Checks

- Node runtime: verify supported Node version, ESM/CommonJS boundary, direct TypeScript execution or transpilation assumptions, import extensions, lifecycle scripts, and production start command.
- Async and shutdown: check unhandled promise rejection handling, signal handling, connection draining, timeout defaults, retry behavior, open handles in tests, and cleanup of database/cache/queue/browser resources.
- Streams and large inputs: prefer bounded body sizes and streaming pipelines for uploads, CSV/ETL, archives, proxies, and exports; check backpressure, temp-file cleanup, decompression limits, and memory growth.
- Fastify: check plugin encapsulation, hook order, schema validation and serialization, auth decorators, `preHandler` coverage, content-type parsers, error handler behavior, logger redaction, CORS/security headers, and `trustProxy`.
- TypeScript: do not treat static types as runtime validation. Check strictness, `any`/unsafe casts at trust boundaries, generated clients, branded IDs for tenant/account/resource identifiers, and type guards or schema validators for external data.
- Advanced type safety issues are security-relevant only when they let untrusted data bypass validation, authorization, money/integrity checks, or safe serialization.

## Supply Chain And Build Review

- Inspect package lifecycle scripts, workspace scripts, postinstall hooks, unpinned Git dependencies, local file dependencies, package overrides, and patch-package diffs.
- Check CI tokens, action pinning, package publish permissions, provenance, artifact promotion, Docker build args, environment injection, source maps, and release gates.
- Prefer lockfile evidence over declared ranges. Distinguish dev-only, test-only, build-time, runtime, and browser-shipped dependencies before assigning severity.
- For dependency or package-script findings, state whether the fix needs a release gate, SBOM/VEX update, package manager policy, action pinning, or artifact signing change.

## Evidence Standard

Each finding must cite a file, route, handler, middleware, config key, lockfile entry, package script, scanner result, request path, or safe local reproduction. Do not report generic framework risk without repo-grounded evidence.

## Output

- Confirmed JS/TS web vulnerabilities and high-confidence actionable findings.
- False positives and unconfirmed scanner leads clearly labeled.
- Framework-specific remediation and verification, including the exact route, test, scanner rerun, or config check that proves the fix.
- Run closeout: scope assessed, candidates processed, findings confirmed, false positives, fixes made, revalidation, residual risks, and follow-up gates.
