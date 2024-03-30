# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:latest as base

COPY ./node_modules ./node_modules
COPY ./src ./src
COPY ./package.json .
COPY ./prisma ./prisma
# COPY --from=prerelease /usr/src/app/node_modules/.prisma /node_modules/.prisma

RUN bunx prisma generate --schema ./prisma/schema.prisma

# run the app
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "src/index.ts" ]
