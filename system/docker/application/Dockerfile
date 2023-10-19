FROM node:18.16.0-alpine as builder

WORKDIR /app

COPY package*.json ./
COPY ./tsconfig.base.json ./
COPY ./nx.json ./
COPY ./libs ./libs
COPY ./types ./types
COPY ./apps/application-name ./apps/application-name

RUN apk add --no-cache git make g++ python3
RUN npm install
RUN npx nx build --bundle application-name --prod

FROM node:18.16.0-alpine as runner

WORKDIR /app

COPY --from=builder app/dist/apps/application-name ./

RUN addgroup --system group && \
    adduser --system -G group user && \
    chown -R user:group .

RUN npm --omit=dev install

CMD [ "node", "main" ]

