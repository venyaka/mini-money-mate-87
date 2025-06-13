# Список изменений после клонирования проекта

## 2024-06-13 — Использование apiRoutes вместо строковых путей

- **src/api/api.ts**  
  Заменены все строковые пути к API на значения из API_ROUTES. Импортирован API_ROUTES из `constants/apiRoutes.ts`.

- **src/constants/apiRoutes.ts**  
  Добавлен объект API_ROUTES с маршрутами для AUTH, USER, BALANCE, TRANSACTIONS.

- **src/services/apiService.ts**  
  Использование API_ROUTES вместо строковых путей в методах класса ApiService.

- **src/components/TelegramAuth.tsx**  
  Заменён строковый путь авторизации на значение из API_ROUTES.AUTH.LOGIN при отправке данных Telegram.

---
