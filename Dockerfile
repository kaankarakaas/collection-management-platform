# --------------------------------------
# BUILD STAGE
# --------------------------------------
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# --------------------------------------
# RUN STAGE
# --------------------------------------
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm install --production --legacy-peer-deps

COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts .
COPY --from=builder /app/tsconfig.json .
COPY --from=builder /app/pages ./pages
COPY --from=builder /app/styles ./styles
COPY --from=builder /app/components ./components

EXPOSE 3000

CMD ["npm", "start"]
