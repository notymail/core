FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY .. /app
WORKDIR /app

FROM base AS builder

RUN apk add --no-cache libc6-compat

RUN pnpm install --frozen-lockfile
RUN pnpm nx build api --verbose

FROM base AS runner

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist/apps/api /app/dist
COPY --from=builder --chown=hono:nodejs /app/dist/apps/api/package.json /app/package.json

USER hono
EXPOSE 3124

CMD ["node", "/app/dist/main.js"]
