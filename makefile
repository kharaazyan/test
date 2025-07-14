CXX = g++
CXXFLAGS = -std=c++17 -I./include
LDFLAGS = -lcrypto -lssl

SRCDIR = src
OBJDIR = obj
BINDIR = build
WEBDIR = web-ui

SOURCES = $(wildcard $(SRCDIR)/*.cpp)
OBJECTS = $(SOURCES:$(SRCDIR)/%.cpp=$(OBJDIR)/%.o)
TARGET = $(BINDIR)/CLI-NetSecTool

WEB_SCRIPTS = start-web.sh stop-web.sh

.PHONY: all clean directories web-install web-build

all: directories $(TARGET) web-build copy-web-scripts

$(TARGET): $(OBJECTS)
	$(CXX) $(OBJECTS) -o $(TARGET) $(LDFLAGS)

$(OBJDIR)/%.o: $(SRCDIR)/%.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

directories:
	@mkdir -p $(OBJDIR) $(BINDIR) $(WEBDIR)

web-build:
	@if [ -f "$(WEBDIR)/frontend/package.json" ]; then \
		cd $(WEBDIR)/frontend && npm install && npm run build; \
	fi
	@if [ -f "$(WEBDIR)/backend/package.json" ]; then \
		cd $(WEBDIR)/backend && npm install; \
	fi

copy-web-scripts:
	@cp $(WEB_SCRIPTS) $(BINDIR)/
	@chmod +x $(BINDIR)/*.sh

clean:
	@rm -rf $(OBJDIR) $(BINDIR)
	@if [ -d "$(WEBDIR)/frontend/node_modules" ]; then \
		rm -rf $(WEBDIR)/frontend/node_modules; \
	fi
	@if [ -d "$(WEBDIR)/backend/node_modules" ]; then \
		rm -rf $(WEBDIR)/backend/node_modules; \
	fi

install: all
	@mkdir -p $(HOME)/bin
	@cp $(TARGET) $(HOME)/bin/
	@cp $(BINDIR)/*.sh $(HOME)/bin/
	@mkdir -p $(HOME)/.cli-netsec-tool
	@cp -r $(WEBDIR) $(HOME)/.cli-netsec-tool/
	@echo "Installation complete. Make sure $(HOME)/bin is in your PATH." 