# syntax=docker/dockerfile:1
FROM node:20-alpine3.19 AS build

RUN --mount=type=bind,src=./package.json,target=/build/package.json,readonly \
    --mount=type=bind,src=./yarn.lock,target=/build/yarn.lock,readonly \
    --mount=type=bind,src=./tsconfig.json,target=/build/tsconfig.json,readonly \
    --mount=type=bind,src=./tsconfig-build.json,target=/build/tsconfig-build.json,readonly \
    --mount=type=bind,src=./src,target=/build/src,readonly \
    --mount=type=bind,target=/root/.yarn,rw \
    #########################################
    cd /build \
 && apk add --no-cache --virtual build-deps git \
 && yarn install --cache-folder /root/.yarn \
 && yarn build \
 && yarn install --cache-folder /root/.yarn --prod \
 && apk del build-deps \
 && mv /build/dist /app \
 && mv /build/node_modules /app/node_modules

CMD ["node", "/app/bot.js"]
