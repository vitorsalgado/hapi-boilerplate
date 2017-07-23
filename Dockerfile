FROM node:8.1.4

WORKDIR /api

COPY package.json yarn.lock ./

RUN mkdir -p logs && \
    chmod -R 777 logs && \
    yarn install --production

COPY . .

USER node

EXPOSE $HB_PORT

CMD npm start-docker