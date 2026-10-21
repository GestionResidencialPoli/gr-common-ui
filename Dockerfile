# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml ./
RUN node -e "const fs=require('fs'); const p=JSON.parse(fs.readFileSync('package.json')); p.dependencies['@gestionresidencial/auth-client']='0.4.1'; p.dependencies['@gestionresidencial/shared-ui']='0.3.1'; fs.writeFileSync('package.json', JSON.stringify(p));"
RUN --mount=type=cache,target=/root/.local/share/pnpm/store pnpm install --no-frozen-lockfile

FROM deps AS build
ARG BACKEND_API_URL=http://localhost:4000
ARG NEXT_PUBLIC_AUTH_UI_URL=http://localhost:3002
ENV BACKEND_API_URL=$BACKEND_API_URL
ENV NEXT_PUBLIC_AUTH_UI_URL=$NEXT_PUBLIC_AUTH_UI_URL
COPY . .
RUN rm -rf packages
# next build directo: "pnpm build" hace que pnpm 12 re-verifique el lockfile contra el
# workspace (que ya no tiene packages/) y falle cuando la capa deps viene de cache.
RUN ./node_modules/.bin/next build

FROM node:22-alpine AS runtime
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
USER app

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget -S -O /dev/null http://127.0.0.1:3000/healthz.txt 2>&1 | grep -q "HTTP/1\." || exit 1

CMD ["node", "server.js"]
