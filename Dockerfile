# ---- Base stage (common) ----
FROM node:24-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

# ---- Development Stage ----
FROM base AS development
RUN npm install
COPY . .
CMD ["sh", "-c", "node server.js & npm run dev"]

# ---- Dependencies Stage ----
FROM base AS deps
RUN npm install --package-lock-only && npm ci --omit=dev --ignore-scripts

# ---- Builder Stage ----
FROM base AS builder
ARG VITE_CESIUM_TOKEN
RUN npm install --package-lock-only && npm ci
COPY . .
RUN npm run build

# ---- Production Stage ----
FROM node:24-alpine AS production
WORKDIR /app
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --chown=node:node server.js ./
COPY --chown=node:node src/meteoriteDataBackup ./src/meteoriteDataBackup

USER node
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE ${PORT}

CMD ["node", "server.js"]