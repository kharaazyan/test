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

.PHONY: all clean directories web-build

all: directories $(TARGET) web-build

$(TARGET): $(OBJECTS)
	$(CXX) $(OBJECTS) -o $(TARGET) $(LDFLAGS)

$(OBJDIR)/%.o: $(SRCDIR)/%.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

directories:
	@mkdir -p $(OBJDIR) $(BINDIR)

web-build:
	@if [ -f "$(WEBDIR)/frontend/package.json" ]; then \
		cd $(WEBDIR)/frontend && npm install && npm run build && \
		mkdir -p ../../$(BINDIR)/web/frontend && \
		cp -r dist ../../$(BINDIR)/web/frontend && \
		cp package.json ../../$(BINDIR)/web/frontend/; \
	fi
	@if [ -f "$(WEBDIR)/backend/package.json" ]; then \
		cd $(WEBDIR)/backend && npm install && \
		if [ ! -f "tsconfig.json" ]; then \
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
		npm run build && \
		mkdir -p ../../$(BINDIR)/web/backend && \
		cp -r dist ../../$(BINDIR)/web/backend && \
		cp package.json ../../$(BINDIR)/web/backend/ && \
		cp -r node_modules ../../$(BINDIR)/web/backend/; \
	fi

clean:
	@rm -rf $(OBJDIR) $(BINDIR)
	@if [ -d "$(WEBDIR)/frontend/node_modules" ]; then \
		rm -rf $(WEBDIR)/frontend/node_modules; \
	fi
	@if [ -d "$(WEBDIR)/backend/node_modules" ]; then \
		rm -rf $(WEBDIR)/backend/node_modules; \
	fi
	@if [ -d "$(WEBDIR)/frontend/dist" ]; then \
		rm -rf $(WEBDIR)/frontend/dist; \
	fi
	@if [ -d "$(WEBDIR)/backend/dist" ]; then \
		rm -rf $(WEBDIR)/backend/dist; \
	fi 