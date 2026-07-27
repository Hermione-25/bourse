# ---- Étape 1 : build ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# ---- Étape 2 : image finale (Nginx) ----
FROM nginx:1.27-alpine

# Angular 22 (build "application") génère dist/<nom-projet>/browser
# Remplacez <nom-projet> par le nom réel dans angular.json
COPY --from=build /app/dist/<bourse-plateforme>/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]