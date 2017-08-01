FROM node:8.2.1

WORKDIR /api

COPY package.json yarn.lock ./

RUN mkdir -p logs && \
    chmod -R 757 logs && \
    yarn install --production

COPY . .

USER node

CMD npm run start-docker
