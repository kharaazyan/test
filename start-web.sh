#!/bin/bash

# Определяем директорию скрипта
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
WEB_DIR="$SCRIPT_DIR/web"

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    exit 1
fi

# Проверяем наличие директории web
if [ ! -d "$WEB_DIR" ]; then
    echo "Error: Web directory not found at $WEB_DIR"
    exit 1
fi

# Запускаем backend в фоновом режиме
cd "$WEB_DIR/backend"
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

# Собираем backend если нужно
if [ ! -d "dist" ]; then
    echo "Building backend..."
    npm run build
fi

# Запускаем backend
npm run serve &
BACKEND_PID=$!

# Ждем, пока backend запустится
sleep 2

# Проверяем, запустился ли backend
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "Error: Failed to start backend"
    exit 1
fi

# Запускаем frontend
cd "$WEB_DIR/frontend"
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Проверяем наличие собранного frontend
if [ ! -d "dist" ]; then
    echo "Building frontend..."
    npm run build
fi

# Запускаем frontend в режиме preview
npm run preview &
FRONTEND_PID=$!

# Ждем запуска frontend
sleep 2

# Проверяем, запустился ли frontend
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "Error: Failed to start frontend"
    kill $BACKEND_PID
    exit 1
fi

# Записываем PID процессов в файл
echo "$BACKEND_PID $FRONTEND_PID" > "$SCRIPT_DIR/.web-pids"

# Выводим информацию о запуске
echo -e "\n\033[1;34m═══════════════════════════════════════════════════════════════════════\033[0m"
echo -e "\033[1;32m🌐 Web interface is running at: http://localhost:5173\033[0m"
echo -e "\033[1;34m═══════════════════════════════════════════════════════════════════════\033[0m" 