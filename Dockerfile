FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Clean npm cache and install dependencies with verbose logging
RUN npm cache clean --force && npm install

COPY . .

RUN npm run build

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]