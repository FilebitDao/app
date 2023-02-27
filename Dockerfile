FROM node:16.14.2-alpine3.14 as builder
ENV NODE_PATH=src/
WORKDIR /usr/app
COPY . .
RUN apk add --update --no-cache git openssh
RUN yarn install
RUN yarn build
#----- Build docker image ----
FROM nginx:1.21.3-alpine
COPY nginx_default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/app/build /usr/share/nginx/html
EXPOSE 4220
CMD ["nginx", "-g", "daemon off;"]
