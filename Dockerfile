# Thanks https://gist.github.com/TheOnlyWayUp/f8733c272090e78e00b9891d2a709117

FROM node:20

WORKDIR /build
COPY src/package*.json .
RUN rm -rf node_modules
RUN rm -rf build
RUN npm install
COPY src/. .
RUN npm ci --omit dev

# Thanks https://stackoverflow.com/q/76988450


EXPOSE 80
ENV PORT=80
ENV HOST=0.0.0.0

CMD [ "node", "build"]