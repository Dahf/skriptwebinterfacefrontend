# 1. Verwende ein leichtes Node.js-Image
FROM node:18-alpine

# 2. Setze das Arbeitsverzeichnis
WORKDIR /app

# 3. Kopiere die `package.json` und `package-lock.json`, um Caching zu nutzen
COPY package.json package-lock.json ./

# 4. Installiere die Abhängigkeiten
RUN npm install

# 5. Kopiere den gesamten Code ins Container-Verzeichnis
COPY . .

# 6. Setze die Umgebungsvariable, damit Vite von außen erreichbar ist
ENV HOST=0.0.0.0

# 7. Öffne den Port für Vite (Standard ist 5173)
EXPOSE 5173

# 8. Starte die Entwicklungsumgebung mit `npm run dev`
CMD ["npm", "run", "dev"]
