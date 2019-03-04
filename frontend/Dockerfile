# build environment
FROM node:11.10-slim as builder
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
RUN npm install
RUN npm install react-scripts@1.1.1 -g
COPY . /usr/src/app
RUN npm run build

# production environment
FROM nginx:1.15.8
RUN rm -rf /etc/nginx/conf.d
COPY nginx /etc/nginx
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
EXPOSE 80

COPY ./docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]
