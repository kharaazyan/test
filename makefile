# === Project Metadata ===
PROJECT      := cli-netsectool
VERSION      := 2.0.0

# === Directories ===
SRC_DIR      := src
INC_DIR      := include
BUILD_DIR    := build
BIN_DIR      := bin
DIST_DIR     := dist
TEST_DIR     := tests
DEPS_DIR     := deps
EXTERNAL_DIR := external
WEB_DIR      := web

# === Tools ===
CXX          ?= g++
AR           ?= ar
RM           := rm -rf
MKDIR        := mkdir -p
CURL         := curl
WGET         := wget
GIT          := git
NPM          := npm

# === Flags ===
CXXFLAGS     := -std=c++20 -Wall -Wextra -I$(INC_DIR) -I$(EXTERNAL_DIR) -I$(EXTERNAL_DIR)/termcolor -I. -pthread -w
LDFLAGS      := -pthread -lcurl -lssl -lcrypto -lspdlog
DEBUG_FLAGS  := -g -O0 -DDEBUG
RELEASE_FLAGS:= -O2 -DNDEBUG

# === Build Type ===
BUILD        := release
CXXFLAGS     += $(RELEASE_FLAGS)
BUILD_TYPE   := Release

# === Source/Objects/Deps ===
SRCS         := $(wildcard $(SRC_DIR)/*.cpp)
OBJS         := $(patsubst $(SRC_DIR)/%.cpp,$(BUILD_DIR)/%.o,$(SRCS))
DEPS         := $(OBJS:.o=.d)

# === Colors ===
GREEN        := \033[0;32m
YELLOW       := \033[1;33m
RED          := \033[0;31m
BLUE         := \033[0;34m
NC           := \033[0m

# === Verbosity ===
V            ?= 0
ifeq ($(V),0)
    Q := @
else
    Q :=
endif

# === External Dependencies URLs ===
IPFS_URL := https://dist.ipfs.tech/kubo/v0.20.0/kubo_v0.20.0_linux-amd64.tar.gz
NLOHMANN_JSON_URL := https://github.com/nlohmann/json/releases/download/v3.12.0/json.hpp
SPDLOG_URL := https://github.com/gabime/spdlog/releases/download/v1.12.0/spdlog.hpp
TERMCOLOR_URL := https://raw.githubusercontent.com/ikalnytskyi/termcolor/master/include/termcolor/termcolor.hpp

# === Dependency Checks ===
.PHONY: all clean rebuild install uninstall test lint format docs help deps main setup auto-clean web-build

# Check system libraries
check-system-libs:
	@echo "$(BLUE)[INFO] Checking system libraries...$(NC)"
	@if ! command -v apt-get >/dev/null 2>&1; then \
		echo "$(RED)[ERROR] This makefile requires apt-get (Ubuntu/Debian)$(NC)" && exit 1; \
	fi
	@echo "$(BLUE)[INFO] Installing required packages...$(NC)"
	@sudo apt-get update
	@sudo apt-get install -y build-essential curl wget git pkg-config
	@sudo apt-get install -y libcurl4-openssl-dev libssl-dev libspdlog-dev nlohmann-json3-dev
	@sudo apt-get install -y libboost-all-dev libsystemd-dev
	@echo "$(GREEN)[✔] System libraries installed$(NC)"

# Check for Node.js and npm
check-web-deps:
	@echo "$(BLUE)[INFO] Checking web dependencies...$(NC)"
	@if ! command -v node >/dev/null 2>&1; then \
		echo "$(YELLOW)[WARN] Node.js not found. Installing...$(NC)" && \
		curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && \
		sudo apt-get install -y nodejs; \
	fi
	@echo "$(GREEN)[✔] Web dependencies check passed$(NC)"

# Install all dependencies
install-deps: check-system-libs check-web-deps
	@echo "$(GREEN)[✔] Dependencies installation complete$(NC)"

# Default target
all: deps main web-build
	@echo "$(GREEN)[✔] Build complete ($(BUILD_TYPE))$(NC)"

# Web interface target
web-build:
	@echo "$(BLUE)[INFO] Building web interface...$(NC)"
	@if [ -f "$(WEB_DIR)/frontend/package.json" ]; then \
		echo "$(BLUE)[INFO] Building frontend...$(NC)" && \
		cd $(WEB_DIR)/frontend && \
		$(NPM) install --silent && \
		$(NPM) run build && \
		if [ -d "dist" ]; then \
			$(MKDIR) -p ../../$(BUILD_DIR)/web/frontend && \
			cp -r dist ../../$(BUILD_DIR)/web/frontend && \
			cp package.json ../../$(BUILD_DIR)/web/frontend/ && \
			echo "$(GREEN)[✔] Frontend built successfully$(NC)"; \
		else \
			echo "$(RED)[ERROR] Frontend build failed - dist directory not created$(NC)" && \
			exit 1; \
		fi \
	else \
		echo "$(YELLOW)[WARN] Frontend package.json not found. Skipping...$(NC)"; \
	fi
	@if [ -f "$(WEB_DIR)/backend/package.json" ]; then \
		echo "$(BLUE)[INFO] Building backend...$(NC)" && \
		cd $(WEB_DIR)/backend && \
		$(NPM) install --silent && \
		if [ ! -f "tsconfig.json" ]; then \
			echo "$(BLUE)[INFO] Creating tsconfig.json...$(NC)" && \
			echo '{ \
				"compilerOptions": { \
					"target": "es2020", \
					"module": "commonjs", \
					"outDir": "./dist", \
					"rootDir": "./src", \
					"strict": true, \
					"esModuleInterop": true, \
					"skipLibCheck": true, \
					"forceConsistentCasingInFileNames": true \
				}, \
				"include": ["src/**/*"], \
				"exclude": ["node_modules"] \
			}' > tsconfig.json; \
		fi && \
		$(NPM) run build && \
		if [ -d "dist" ]; then \
			$(MKDIR) -p ../../$(BUILD_DIR)/web/backend && \
			cp -r dist ../../$(BUILD_DIR)/web/backend && \
			cp package.json ../../$(BUILD_DIR)/web/backend/ && \
			cp -r node_modules ../../$(BUILD_DIR)/web/backend/ && \
			echo "$(GREEN)[✔] Backend built successfully$(NC)"; \
		else \
			echo "$(RED)[ERROR] Backend build failed - dist directory not created$(NC)" && \
			exit 1; \
		fi \
	else \
		echo "$(YELLOW)[WARN] Backend package.json not found. Skipping...$(NC)"; \
	fi

# Build main executable
main: $(TARGET)
	@echo "$(GREEN)[✔] Main built successfully$(NC)"

$(TARGET): $(OBJS) | $(BIN_DIR) $(BUILD_DIR) $(DIST_DIR)
	@echo "$(YELLOW)[Linking] $@$(NC)"
	$(Q)$(CXX) $(CXXFLAGS) $^ -o $@ $(LDFLAGS)

$(BUILD_DIR)/%.o: $(SRC_DIR)/%.cpp | $(BUILD_DIR)
	@echo "$(YELLOW)[Compiling] $<$(NC)"
	$(Q)$(CXX) $(CXXFLAGS) -MMD -c $< -o $@

$(BUILD_DIR) $(BIN_DIR) $(DIST_DIR):
	$(Q)$(MKDIR) $@

-include $(DEPS)

clean:
	$(Q)$(RM) $(BUILD_DIR) $(BIN_DIR) $(DIST_DIR)
	@if [ -d "$(WEB_DIR)/frontend/node_modules" ]; then \
		$(RM) $(WEB_DIR)/frontend/node_modules; \
	fi
	@if [ -d "$(WEB_DIR)/backend/node_modules" ]; then \
		$(RM) $(WEB_DIR)/backend/node_modules; \
	fi
	@if [ -d "$(WEB_DIR)/frontend/dist" ]; then \
		$(RM) $(WEB_DIR)/frontend/dist; \
	fi
	@if [ -d "$(WEB_DIR)/backend/dist" ]; then \
		$(RM) $(WEB_DIR)/backend/dist; \
	fi
	@echo "$(GREEN)[✔] Cleaned$(NC)"

clean-all: clean
	@echo "$(GREEN)[✔] All cleaned$(NC)"

rebuild: clean all

# === Installation Targets ===
install: $(TARGET)
	@echo "$(BLUE)[INFO] Installing $(PROJECT)...$(NC)"
	@sudo cp $(TARGET) /usr/local/bin/ || \
		(echo "$(RED)[ERROR] Failed to install main. Try running with sudo.$(NC)" && exit 1)
	@echo "$(GREEN)[✔] $(PROJECT) installed to /usr/local/bin/$(NC)"

uninstall:
	@echo "$(BLUE)[INFO] Uninstalling $(PROJECT)...$(NC)"
	@sudo rm -f /usr/local/bin/$(PROJECT) || true
	@echo "$(GREEN)[✔] $(PROJECT) uninstalled$(NC)"

# === Help ===
help:
	@echo "$(BLUE)CLI-NetSecTool Build System (Ubuntu/Debian Only)$(NC)"
	@echo ""
	@echo "$(GREEN)Usage:$(NC) make [target] [V=1]"
	@echo ""
	@echo "$(GREEN)Build Targets:$(NC)"
	@echo "  all        - Setup, install deps, build CLI and web interface (default)"
	@echo "  main       - Build only main executable"
	@echo "  web-build  - Build only web interface"
	@echo "  deps       - Install all dependencies"
	@echo "  clean      - Remove build artifacts"
	@echo "  clean-all  - Remove all artifacts"
	@echo "  rebuild    - Clean and build"
	@echo ""
	@echo "$(GREEN)Installation Targets:$(NC)"
	@echo "  install    - Install to system"
	@echo "  uninstall  - Remove from system"
	@echo ""
	@echo "$(GREEN)Variables:$(NC)"
	@echo "  V          - Verbose build (V=1)"
	@echo ""
	@echo "$(GREEN)Dependencies:$(NC)"
	@echo "  Ubuntu/Debian system"
	@echo "  C++20 compiler (g++)"
	@echo "  Node.js and npm (web interface)"
	@echo "  System libraries (installed automatically)" 