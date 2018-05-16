FROM node:alpine

RUN mkdir /src 
WORKDIR /src

COPY . /src

RUN npm install

EXPOSE 3000


ENTRYPOINT [ "node", "./bin/www" ]
