FROM node:24-alpine AS frontend-build

WORKDIR /workspace/frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend ./

RUN mkdir -p /workspace/backend/public

RUN npm run build

FROM node:24-alpine

WORKDIR /app

COPY backend/package*.json ./

RUN npm install

COPY backend ./

COPY --from=frontend-build /workspace/backend/public ./public

EXPOSE 3002

CMD ["npm", "run", "start"]
