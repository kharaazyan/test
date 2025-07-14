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
WEB_DIR      := web  # added web directory

# === Tools ===
CXX          ?= g++
AR           ?= ar
RM           := rm -rf
MKDIR        := mkdir -p
CURL         := curl
WGET         := wget
GIT          := git
NPM          := npm  # added npm tool

.ONESHELL:  # use single shell per recipe

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

# Config is header-only, no separate compilation needed

# === Executable(s) ===
TARGET       := $(BIN_DIR)/$(PROJECT)

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
.PHONY: check-deps install-deps check-system-libs download-external-deps check-ipfs install-ipfs

# Check system libraries
check-system-libs:
	@echo "$(BLUE)[INFO] Checking system libraries...$(NC)"
	@echo "$(BLUE)[INFO] Checking libcurl...$(NC)"
	@pkg-config --exists libcurl || \
		(echo "$(YELLOW)[WARN] libcurl not found. Installing...$(NC)" && \
		sudo apt-get install -y libcurl4-openssl-dev || true)
	
	@echo "$(BLUE)[INFO] Checking OpenSSL...$(NC)"
	@pkg-config --exists openssl || \
		(echo "$(YELLOW)[WARN] OpenSSL not found. Installing...$(NC)" && \
		sudo apt-get install -y libssl-dev || true)
	
	@echo "$(BLUE)[INFO] Checking pkg-config...$(NC)"
	@which pkg-config > /dev/null 2>&1 || \
		(echo "$(YELLOW)[WARN] pkg-config not found. Installing...$(NC)" && \
		sudo apt-get install -y pkg-config || true)
	
	@echo "$(BLUE)[INFO] Checking spdlog...$(NC)"
	@pkg-config --exists spdlog || \
		(echo "$(YELLOW)[WARN] spdlog not found. Installing...$(NC)" && \
		sudo apt-get install -y libspdlog-dev || true)
	
	@echo "$(BLUE)[INFO] Checking nlohmann-json...$(NC)"
	@pkg-config --exists nlohmann_json || \
		(echo "$(YELLOW)[WARN] nlohmann-json not found. Installing...$(NC)" && \
		sudo apt-get install -y nlohmann-json3-dev || true)
	@echo "$(GREEN)[✔] System libraries check passed$(NC)"

# Check if IPFS is installed
check-ipfs:
	@echo "$(BLUE)[INFO] Checking IPFS installation...$(NC)"
	@which ipfs > /dev/null 2>&1 || \
		(echo "$(YELLOW)[WARN] IPFS not found. Installing...$(NC)" && $(MAKE) install-ipfs)
	@echo "$(GREEN)[✔] IPFS check passed$(NC)"

# Install IPFS
install-ipfs:
	@echo "$(BLUE)[INFO] Installing IPFS manually...$(NC)"
	@mkdir -p $(DEPS_DIR)
	@cd $(DEPS_DIR) && \
		($(WGET) -q $(IPFS_URL) -O ipfs.tar.gz || $(CURL) -L -o ipfs.tar.gz $(IPFS_URL)) && \
		tar -xzf ipfs.tar.gz && \
		sudo cp kubo/ipfs /usr/local/bin/ && \
		rm -rf kubo ipfs.tar.gz
	@rm -rf $(DEPS_DIR)
	@echo "$(GREEN)[✔] IPFS installed successfully$(NC)"

# Download external dependencies
download-external-deps:
	@echo "$(BLUE)[INFO] Downloading external dependencies...$(NC)"
	@mkdir -p $(EXTERNAL_DIR)
	
	# Download nlohmann/json
	@echo "$(BLUE)[INFO] Downloading nlohmann/json v3.12.0...$(NC)"
	@if [ ! -f $(EXTERNAL_DIR)/json.hpp ]; then \
		($(WGET) -q $(NLOHMANN_JSON_URL) -O $(EXTERNAL_DIR)/json.hpp || \
		$(CURL) -L -o $(EXTERNAL_DIR)/json.hpp $(NLOHMANN_JSON_URL)) && \
		echo "$(GREEN)[✔] nlohmann/json downloaded$(NC)" || \
		echo "$(RED)[ERROR] Failed to download nlohmann/json$(NC)"; \
	else \
		echo "$(GREEN)[✔] nlohmann/json already exists$(NC)"; \
	fi
	
	# Download spdlog
	@echo "$(BLUE)[INFO] Downloading spdlog...$(NC)"
	@if [ ! -f $(EXTERNAL_DIR)/spdlog.hpp ]; then \
		($(WGET) -q $(SPDLOG_URL) -O $(EXTERNAL_DIR)/spdlog.hpp || \
		$(CURL) -L -o $(EXTERNAL_DIR)/spdlog.hpp $(SPDLOG_URL)) && \
		echo "$(GREEN)[✔] spdlog downloaded$(NC)" || \
		echo "$(RED)[ERROR] Failed to download spdlog$(NC)"; \
	else \
		echo "$(GREEN)[✔] spdlog already exists$(NC)"; \
	fi
	
	# Download termcolor
	@echo "$(BLUE)[INFO] Downloading termcolor...$(NC)"
	@mkdir -p $(EXTERNAL_DIR)/termcolor
	@if [ ! -f $(EXTERNAL_DIR)/termcolor/termcolor.hpp ]; then \
		($(WGET) -q $(TERMCOLOR_URL) -O $(EXTERNAL_DIR)/termcolor/termcolor.hpp || \
		$(CURL) -L -o $(EXTERNAL_DIR)/termcolor/termcolor.hpp $(TERMCOLOR_URL)) && \
		echo "$(GREEN)[✔] termcolor downloaded$(NC)" || \
		echo "$(RED)[ERROR] Failed to download termcolor$(NC)"; \
	else \
		echo "$(GREEN)[✔] termcolor already exists$(NC)"; \
	fi

# Check and install system dependencies
check-deps: check-ipfs check-system-libs
	@echo "$(BLUE)[INFO] Checking system dependencies...$(NC)"
	@which apt-get > /dev/null 2>&1 || \
		(echo "$(RED)[ERROR] apt-get not found. This makefile is for Ubuntu only.$(NC)" && exit 1)
	@echo "$(GREEN)[✔] System dependencies check passed$(NC)"

# Install all dependencies
install-deps: check-deps download-external-deps
	@echo "$(BLUE)[INFO] Installing build dependencies...$(NC)"
	@echo "$(BLUE)[INFO] Installing via apt-get...$(NC)"
	@sudo apt-get update || true
	@sudo apt-get install -y build-essential || true
	@sudo apt-get install -y curl wget git pkg-config || true
	@sudo apt-get install -y libcurl4-openssl-dev libssl-dev libspdlog-dev nlohmann-json3-dev || true
	@echo "$(GREEN)[✔] Dependencies installation complete$(NC)"

# === Build Targets ===
.PHONY: all clean rebuild install uninstall test lint format docs help deps main setup auto-clean web-build

# Default target (CLI + Web)
all: deps main web-build
	@echo "$(GREEN)[✔] Build complete ($(BUILD_TYPE))$(NC)"

# --- Web Build ---

web-build:
	@set -e; \
	echo "$(BLUE)[INFO] Building web interface in dir: $(CURDIR)$(NC)"; \
	ls -al $(WEB_DIR) || true; \
	if [ -f "$(WEB_DIR)/frontend/package.json" ]; then \
		echo "$(BLUE)[INFO] Building frontend...$(NC)"; \
		cd $(WEB_DIR)/frontend; \
		$(NPM) install --silent; \
		$(NPM) run build; \
		cd - >/dev/null; \
		$(MKDIR) -p $(DIST_DIR)/web/frontend; \
		cp -r $(WEB_DIR)/frontend/dist $(DIST_DIR)/web/frontend/; \
		cp $(WEB_DIR)/frontend/package.json $(DIST_DIR)/web/frontend/; \
		echo "$(GREEN)[✔] Frontend built successfully$(NC)"; \
	else \
		echo "$(YELLOW)[WARN] Frontend package.json not found - skipping frontend build.$(NC)"; \
	fi; \
	if [ -f "$(WEB_DIR)/backend/package.json" ]; then \
		echo "$(BLUE)[INFO] Building backend...$(NC)"; \
		cd $(WEB_DIR)/backend; \
		$(NPM) install --silent; \
		if [ ! -f tsconfig.json ]; then \
			echo '{"compilerOptions":{"target":"es2020","module":"commonjs","outDir":"./dist","rootDir":"./src","strict":true,"esModuleInterop":true,"skipLibCheck":true}}' > tsconfig.json; \
		fi; \
		$(NPM) run build; \
		cd - >/dev/null; \
		$(MKDIR) -p $(DIST_DIR)/web/backend; \
		cp -r $(WEB_DIR)/backend/dist $(DIST_DIR)/web/backend/; \
		cp $(WEB_DIR)/backend/package.json $(DIST_DIR)/web/backend/; \
		cp -r $(WEB_DIR)/backend/node_modules $(DIST_DIR)/web/backend/; \
		echo "$(GREEN)[✔] Backend built successfully$(NC)"; \
	else \
		echo "$(YELLOW)[WARN] Backend package.json not found - skipping backend build.$(NC)"; \
	fi

# Setup target - run setup script
setup:
	@echo "$(BLUE)[INFO] Running setup script...$(NC)"
	@if [ -f setup.sh ]; then \
		chmod +x setup.sh && ./setup.sh; \
	else \
		echo "$(YELLOW)[WARN] setup.sh not found. Skipping setup.$(NC)"; \
	fi

# Dependencies target
deps: install-deps

# Build main executable
main: $(TARGET)
	@echo "$(GREEN)[✔] Main built successfully$(NC)"

$(TARGET): $(OBJS) | $(BIN_DIR) $(BUILD_DIR) $(DIST_DIR) $(DEPS_DIR) $(EXTERNAL_DIR)
	@echo "$(YELLOW)[Linking] $@$(NC)"
	$(Q)$(CXX) $(CXXFLAGS) $^ -o $@ $(LDFLAGS)

$(BUILD_DIR)/%.o: $(SRC_DIR)/%.cpp | $(BUILD_DIR)
	@echo "$(YELLOW)[Compiling] $<$(NC)"
	$(Q)$(CXX) $(CXXFLAGS) -MMD -c $< -o $@

$(BUILD_DIR) $(BIN_DIR) $(DIST_DIR) $(DEPS_DIR) $(EXTERNAL_DIR):
	$(Q)$(MKDIR) $@

-include $(DEPS)

clean:
	$(Q)$(RM) $(BUILD_DIR) $(BIN_DIR) $(DIST_DIR)
	@echo "$(GREEN)[✔] Cleaned$(NC)"

clean-deps:
	$(Q)$(RM) $(DEPS_DIR)
	@echo "$(GREEN)[✔] Dependencies cleaned$(NC)"

clean-external:
	$(Q)$(RM) $(EXTERNAL_DIR)
	@echo "$(GREEN)[✔] External libraries cleaned$(NC)"

clean-all: clean clean-deps clean-external
	@echo "$(GREEN)[✔] All cleaned$(NC)"

# Auto-clean target
auto-clean:
	@echo "$(BLUE)[INFO] Running auto-clean...$(NC)"
	@if [ -f auto-clean.sh ]; then \
		chmod +x auto-clean.sh && ./auto-clean.sh; \
	else \
		echo "$(YELLOW)[WARN] auto-clean.sh not found.$(NC)"; \
	fi

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
	@echo "$(BLUE)Sergo Decryptor Build System (Ubuntu Only)$(NC)"
	@echo ""
	@echo "$(GREEN)Usage:$(NC) make [target] [V=1]"
	@echo ""
	@echo "$(GREEN)Build Targets:$(NC)"
	@echo "  all        - Setup, install deps, and build (default)"
	@echo "  setup      - Run automated setup script"
	@echo "  main       - Build only main executable"
	@echo "  deps       - Install all dependencies"
	@echo "  clean      - Remove build artifacts"
	@echo "  clean-deps - Remove downloaded dependencies"
	@echo "  clean-external - Remove external libraries"
	@echo "  clean-all  - Remove all artifacts and dependencies"
	@echo "  auto-clean - Run auto-clean script"
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
	@echo "  C++20 compiler (g++)"
	@echo "  nlohmann/json v3.12.0"
	@echo "  spdlog v1.12.0 (logging)"
	@echo "  libcurl (HTTP requests)"
	@echo "  libssl (encryption/decryption)"
	@echo "  libcrypto++ (advanced cryptography)"
	@echo "  termcolor (CLI colors)"
	@echo "  IPFS v0.20.0 (distributed storage)"
	@echo "  Standard Ubuntu libraries" 