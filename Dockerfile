# ---- Stage 1: Build ----
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# A variável VITE_API_URL precisa estar disponível em build-time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---- Stage 2: Serve com Nginx ----
FROM nginx:alpine

# Copiar o build do Vite para o Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# A configuração do Nginx será montada via docker-compose
# ou pode ser copiada manualmente:
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
