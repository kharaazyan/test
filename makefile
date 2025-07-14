CXX = g++
CXXFLAGS = -std=c++17 -I./include
LDFLAGS = -lcrypto -lssl

SRCDIR = src
OBJDIR = obj
BINDIR = build
WEBDIR = web

SOURCES = $(wildcard $(SRCDIR)/*.cpp)
OBJECTS = $(SOURCES:$(SRCDIR)/%.cpp=$(OBJDIR)/%.o)
TARGET = $(BINDIR)/CLI-NetSecTool

.PHONY: all clean directories setup build deps web-build

# Default target
all: setup build

# Setup target - installs dependencies and initializes the project
setup: check-deps install-deps init-project

# Build target - builds CLI tool and web interface
build: directories $(TARGET) web-build

# Check for required dependencies
check-deps:
	@echo "Checking dependencies..."
	@which node >/dev/null 2>&1 || (echo "Installing Node.js..." && \
		curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && \
		sudo apt-get install -y nodejs)
	@which npm >/dev/null 2>&1 || echo "npm is required but will be installed with Node.js"
	@which make >/dev/null 2>&1 || (echo "Installing make..." && sudo apt-get install -y build-essential)
	@which ipfs >/dev/null 2>&1 || (echo "Installing IPFS..." && \
		cd /tmp && \
		wget -q "https://dist.ipfs.tech/kubo/v0.20.0/kubo_v0.20.0_linux-amd64.tar.gz" -O ipfs.tar.gz && \
		tar -xzf ipfs.tar.gz && \
		sudo cp kubo/ipfs /usr/local/bin/ && \
		rm -rf kubo ipfs.tar.gz)

# Install system dependencies
install-deps:
	@echo "Installing system dependencies..."
	@sudo apt-get update
	@sudo apt-get install -y build-essential curl wget git pkg-config
	@sudo apt-get install -y libcurl4-openssl-dev libssl-dev libcrypto++-dev
	@sudo apt-get install -y libspdlog-dev nlohmann-json3-dev
	@sudo apt-get install -y libboost-all-dev libsystemd-dev

# Initialize project (create directories, generate keys, etc.)
init-project:
	@echo "Initializing project..."
	@mkdir -p config keys logs cache test_data certs
	@if [ ! -f "keys/private_key.zip" ]; then \
		openssl genrsa -out keys/private_key.pem 2048; \
		openssl rsa -in keys/private_key.pem -pubout -out keys/public_key.pem; \
		echo "cli-netsectool-password-2025" > keys/password.txt; \
		zip -P "cli-netsectool-secure-2025" keys/private_key.zip keys/private_key.pem; \
		zip -P "cli-netsectool-secure-2025" keys/p.zip keys/password.txt; \
		chmod 600 keys/private_key.pem keys/public_key.pem keys/private_key.zip keys/p.zip; \
		rm -f keys/private_key.pem keys/password.txt; \
	fi
	@if [ ! -d "$$HOME/.ipfs" ]; then \
		ipfs init; \
	fi
	@if ! ipfs key list | grep -q "cli-netsectool"; then \
		ipfs key gen cli-netsectool --type=rsa --size=2048; \
	fi
	@if [ ! -f "keys/ipns_key.txt" ]; then \
		ipfs key list | grep "cli-netsectool" | awk '{print $$1}' > keys/ipns_key.txt; \
		chmod 600 keys/ipns_key.txt; \
	fi

# Create directories
directories:
	@mkdir -p $(OBJDIR) $(BINDIR)

# Build CLI tool
$(TARGET): $(OBJECTS)
	$(CXX) $(OBJECTS) -o $(TARGET) $(LDFLAGS)

$(OBJDIR)/%.o: $(SRCDIR)/%.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

# Build web interface
web-build:
	@echo "Building web interface..."
	@mkdir -p $(BINDIR)/web
	@if [ -d "$(WEBDIR)/frontend" ]; then \
		cd $(WEBDIR)/frontend && \
		npm install --silent && \
		npm run build && \
		cp -r dist ../../$(BINDIR)/web/frontend && \
		cp package.json ../../$(BINDIR)/web/frontend/; \
	fi
	@if [ -d "$(WEBDIR)/backend" ]; then \
		cd $(WEBDIR)/backend && \
		npm install --silent && \
		npm run build && \
		cp -r dist ../../$(BINDIR)/web/backend && \
		cp package.json ../../$(BINDIR)/web/backend/ && \
		cp -r node_modules ../../$(BINDIR)/web/backend/; \
	fi

# Clean build artifacts
clean:
	@rm -rf $(OBJDIR) $(BINDIR)
	@rm -rf $(WEBDIR)/frontend/node_modules $(WEBDIR)/backend/node_modules
	@rm -rf $(WEBDIR)/frontend/dist $(WEBDIR)/backend/dist
	@echo "Cleaned build artifacts"

# Clean everything including dependencies and configuration
clean-all: clean
	@rm -rf config/* keys/* logs/* cache/* test_data/* certs/*
	@echo "Cleaned all project files" 