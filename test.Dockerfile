FROM node:14.15.4
RUN npm install -g @angular/cli@11.0.5
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm install
