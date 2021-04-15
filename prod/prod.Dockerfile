#Build app from Angular

FROM node:14.15.4 as build-step
RUN npm install -g @angular/cli@11.0.5
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN rm -rf dist
RUN npm install
RUN ng build --prod

#Use Nginx
FROM nginx:1.18
WORKDIR /etc/nginx/conf.d
RUN rm default.conf
COPY ./prod/server_web.conf.template ./server_web.conf.template
COPY --from=build-step /usr/src/app/dist/crypto-arbitrage/ /var/www/html
