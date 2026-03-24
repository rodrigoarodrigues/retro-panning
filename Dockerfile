FROM node:22-alpine

WORKDIR /app

# Instala dependências (camada de cache)
COPY package.json package-lock.json* ./
RUN npm install

# O source é montado como volume — hot-reload sem rebuild da imagem
EXPOSE 5173

CMD ["npm", "run", "dev"]
