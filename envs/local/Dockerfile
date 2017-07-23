FROM node:8.1.4

WORKDIR /api
VOLUME /api

COPY package.json yarn.lock ./

RUN chown -R 1000:1000 /api && \
    yarn

EXPOSE 3000

CMD yarn start-dev