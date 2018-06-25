FROM ubuntu:18.04
RUN apt-get update && apt-get install -y curl gnupg2
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

WORKDIR /app
COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
