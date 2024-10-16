FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=development
ENV PORT=8000

EXPOSE 8000

CMD [ "npm", "run", "dev" ]