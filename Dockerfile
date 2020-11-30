FROM node:14.8.0 AS build

ENV NODE_ENV=development

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN NEXT_TELEMETRY_DISABLED=1 DYNAMODB_REGION="eu-west-3" yarn build 

FROM node:14.8.0-alpine

WORKDIR /app

COPY --from=build /app/package.json /app/yarn.lock ./
COPY --from=build /app/.next ./.next

ENV NODE_ENV=production

RUN yarn install --production --frozen-lockfile

CMD ["yarn", "start"]
