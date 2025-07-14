пше#!/bin/bash

# Определяем цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Проверяем наличие необходимых инструментов
command -v node >/dev/null 2>&1 || { echo -e "${RED}Error: Node.js is not installed${NC}" >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo -e "${RED}Error: npm is not installed${NC}" >&2; exit 1; }
command -v make >/dev/null 2>&1 || { echo -e "${RED}Error: make is not installed${NC}" >&2; exit 1; }

# Определяем директории
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
WEB_DIR="$SCRIPT_DIR/web"

# Проверяем наличие web директории
if [ ! -d "$WEB_DIR" ]; then
    echo -e "${RED}Error: Web directory not found at $WEB_DIR${NC}"
    exit 1
fi

echo -e "${BLUE}=== Building Nexus CLI Tool ===${NC}"

# Компилируем CLI
echo -e "${BLUE}[1/4] Building CLI tool...${NC}"
make clean && make
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to build CLI tool${NC}"
    exit 1
fi
echo -e "${GREEN}✓ CLI tool built successfully${NC}"

# Устанавливаем зависимости и собираем frontend
echo -e "${BLUE}[2/4] Building frontend...${NC}"
cd "$WEB_DIR/frontend"
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to install frontend dependencies${NC}"
        exit 1
    fi
fi

npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to build frontend${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Frontend built successfully${NC}"

# Устанавливаем зависимости и собираем backend
echo -e "${BLUE}[3/4] Building backend...${NC}"
cd "$WEB_DIR/backend"
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to install backend dependencies${NC}"
        exit 1
    fi
fi

npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to build backend${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Backend built successfully${NC}"

# Копируем веб-приложение в директорию сборки
echo -e "${BLUE}[4/4] Packaging web interface...${NC}"
WEB_DIST="$SCRIPT_DIR/build/web"
mkdir -p "$WEB_DIST"
cp -r "$WEB_DIR/frontend/dist" "$WEB_DIST/frontend"
cp -r "$WEB_DIR/backend/dist" "$WEB_DIST/backend"
cp -r "$WEB_DIR/backend/package.json" "$WEB_DIST/backend/"
cp -r "$WEB_DIR/frontend/package.json" "$WEB_DIST/frontend/"

# Копируем node_modules для production
if [ -d "$WEB_DIR/backend/node_modules" ]; then
    cp -r "$WEB_DIR/backend/node_modules" "$WEB_DIST/backend/"
fi

echo -e "${GREEN}=== Build Complete ===${NC}"
echo -e "${BLUE}The application has been built successfully.${NC}"
echo -e "${BLUE}To run the application:${NC}"
echo -e "1. Make sure you have Node.js installed"
echo -e "2. Run the CLI tool: ${GREEN}./build/CLI-NetSecTool${NC}"
echo -e "3. The web interface will start automatically"
echo -e "4. Access the web interface at ${GREEN}http://localhost:5173${NC}" 