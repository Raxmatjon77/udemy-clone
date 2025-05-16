FROM node:20.12-alpine AS build

ENV TZ UTC
ENV NODE_ENV deveploment

WORKDIR /app

COPY .npmrc .npmrc
COPY .eslintrc .eslintrc
COPY .prettierrc .prettierrc
COPY .eslintignore .eslintignore
COPY .prettierignore .prettierignore
COPY .editorconfig .editorconfig
COPY package.json package.json
COPY tsconfig.json tsconfig.json
COPY tsconfig.build.json tsconfig.build.json
COPY nest.config.json nest.config.json
COPY pnpm-lock.yaml pnpm-lock.yaml
COPY assets assets
COPY src src

RUN corepack enable
RUN corepack prepare pnpm@latest --activate
RUN pnpm config set store-dir .pnpm
RUN pnpm install --no-frozen-lockfile
RUN pnpm fmt
RUN pnpm build
RUN pnpm prune --prod

FROM node:20.12-alpine

RUN apk add --no-cache tzdata

ENV TZ Asia/Tashkent
ENV NODE_ENV production

USER node

WORKDIR /app

COPY --from=build --chown=node:node /app/dist dist
COPY --from=build --chown=node:node /app/assets assets
COPY --from=build --chown=node:node /app/node_modules node_modules
COPY --from=build --chown=node:node /app/package.json package.json
COPY --from=build --chown=node:node /app/pnpm-lock.yaml pnpm-lock.yaml

HEALTHCHECK --retries=3 --timeout=5s --interval=5s CMD node dist/ping.js

CMD node dist/main.js
