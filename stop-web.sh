#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PID_FILE="$SCRIPT_DIR/.web-pids"

if [ -f "$PID_FILE" ]; then
    read BACKEND_PID FRONTEND_PID < "$PID_FILE"
    
    # Проверяем и останавливаем frontend
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        echo "Stopping frontend process..."
        kill $FRONTEND_PID
        wait $FRONTEND_PID 2>/dev/null
    fi
    
    # Проверяем и останавливаем backend
    if kill -0 $BACKEND_PID 2>/dev/null; then
        echo "Stopping backend process..."
        kill $BACKEND_PID
        wait $BACKEND_PID 2>/dev/null
    fi
    
    # Удаляем файл с PID
    rm "$PID_FILE"
    
    echo -e "\033[1;32m✓ Web interface stopped successfully\033[0m"
else
    echo -e "\033[1;33m! Web interface is not running (PID file not found)\033[0m"
fi 