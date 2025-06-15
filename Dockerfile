# 🔨 Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем ВСЕ зависимости (включая dev-зависимости, чтобы vite был доступен)
RUN npm install

# Копируем остальной код
COPY . .

# Собираем проект
RUN npm run build

# 🚀 Production stage
FROM node:18-alpine

WORKDIR /app

# Устанавливаем минимальный сервер
RUN npm install -g serve

# Копируем собранный фронт из build stage
COPY --from=build /app/dist ./dist

# Открываем порт
EXPOSE 5173

# Запуск через serve
CMD ["serve", "-s", "dist", "-l", "5173"]
