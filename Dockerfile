# syntax=docker/dockerfile:1
FROM node:14.21-alpine3.16 AS build

RUN --mount=type=bind,src=./package.json,target=/build/package.json,readonly \
    --mount=type=bind,src=./yarn.lock,target=/build/yarn.lock,readonly \
    --mount=type=bind,src=./tsconfig.json,target=/build/tsconfig.json,readonly \
    --mount=type=bind,src=./tsconfig-build.json,target=/build/tsconfig-build.json,readonly \
    --mount=type=bind,src=./src,target=/build/src,readonly \
    --mount=type=bind,target=/root/.yarn,rw \
    #########################################
    cd /build \
 && yarn install --cache-folder /root/.yarn \
 && yarn build \
 && yarn install --cache-folder /root/.yarn --prod \
 && mv /build/dist /app \
 && mv /build/node_modules /app/node_modules

CMD ["node", "/app/bot.js"]
