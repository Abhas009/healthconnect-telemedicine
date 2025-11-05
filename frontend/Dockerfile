FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --quiet || npm install
COPY index.html ./index.html
COPY src ./src
EXPOSE 3000
RUN npm run build
CMD ["npm", "run", "preview"]
