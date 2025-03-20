# Basis-Image für Node.js (zum Bauen der App)
FROM node:18-alpine AS builder

# Arbeitsverzeichnis setzen
WORKDIR /app

# Package.json und Abhängigkeiten installieren
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Code kopieren und Vite-Build erstellen
COPY . .
RUN npm run build

# Basis-Image für den Webserver (nginx)
FROM nginx:alpine

# Build-Dateien in den Webserver kopieren
COPY --from=builder /app/dist /usr/share/nginx/html

# Port freigeben und Nginx starten
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
