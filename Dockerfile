# 1. Verwende ein Node.js-Image (Alpine ist leichtgewichtig)
FROM node:18-alpine

# 2. Setze das Arbeitsverzeichnis
WORKDIR /app

# 3. Kopiere zuerst die package.json
COPY package.json ./

# 4. Installiere Abhängigkeiten
RUN npm install

# 5. Kopiere den restlichen Code ins Docker-Image
COPY . .

# 6. Stelle sicher, dass Vite von außen erreichbar ist
ENV HOST=0.0.0.0

# 7. Öffne den Port für Vite (Standard ist 5173)
EXPOSE 5173

# 8. Starte den Entwicklungsserver
CMD ["npm", "run", "dev"]
