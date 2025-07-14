# Nexus Web Console

Веб-интерфейс для управления CLI-NetSecTool, построенный с использованием React и Express.

## Структура проекта

```
web/
├── frontend/        # React приложение
├── backend/         # Express сервер
└── README.md       # Этот файл
```

## Требования

- Node.js >= 18
- npm >= 9
- Установленный и собранный CLI-NetSecTool

## Установка

1. Установите зависимости для frontend:
```bash
cd frontend
npm install
```

2. Установите зависимости для backend:
```bash
cd ../backend
npm install
```

## Запуск для разработки

1. Запустите backend сервер:
```bash
cd backend
npm run dev
```

2. В другом терминале запустите frontend:
```bash
cd frontend
npm run dev
```

Frontend будет доступен по адресу: http://localhost:5173
Backend API будет доступен по адресу: http://localhost:3001

## Сборка для продакшена

1. Соберите frontend:
```bash
cd frontend
npm run build
```

2. Соберите backend:
```bash
cd ../backend
npm run build
```

3. Запустите продакшен сервер:
```bash
cd backend
npm run serve
```

## Основные функции

- 🖥️ Интерактивный терминал с поддержкой всех команд CLI
- 📊 Мониторинг состояния IPFS узла
- 🔑 Управление ключами шифрования
- 📝 Просмотр и анализ логов
- 🌐 Real-time обновления через WebSocket

## Разработка

- Frontend построен на React + TypeScript с использованием Vite
- UI компоненты из библиотеки Mantine
- Backend на Express + TypeScript
- WebSocket для real-time коммуникации
- Интеграция с CLI через child_process 