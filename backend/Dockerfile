# Stage 1: Build backend
FROM node:20-alpine AS backend-build
RUN apk add --no-cache python3 make g++
WORKDIR /app/backend
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine
RUN apk add --no-cache zip
WORKDIR /app
COPY --from=backend-build /app/backend/dist ./dist
COPY --from=backend-build /app/backend/node_modules ./node_modules
COPY --from=backend-build /app/backend/package.json ./
RUN mkdir -p /data/packages

EXPOSE 8080

ARG BUILD_COMMIT=unknown
ARG BUILD_DATE=unknown
ENV DATA_DIR=/data \
  PORT=8080 \
  BUILD_COMMIT=$BUILD_COMMIT \
  BUILD_DATE=$BUILD_DATE

CMD ["node", "dist/index.js"]
