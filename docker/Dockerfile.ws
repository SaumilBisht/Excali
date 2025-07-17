FROM node:22-slim

RUN apt-get update && apt-get install -y openssl
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/app

COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ./package.json ./package.json
COPY ./turbo.json ./turbo.json
COPY ./packages ./packages
COPY ./apps/ws-backend ./apps/ws-backend

RUN pnpm install --verbose

COPY . .

RUN pnpm run db:generate

EXPOSE 8080
CMD ["pnpm","run","start:ws"]