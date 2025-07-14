#include "config.hpp"
#include <fstream>
#include <iostream>
#include <filesystem>
#include <sstream>
#include <algorithm>
#include <cstring>

// Include nlohmann/json if available
#ifdef __has_include
#if __has_include(<nlohmann/json.hpp>)
#include <nlohmann/json.hpp>
using json = nlohmann::json;
#else
#include "external/json.hpp"
using json = nlohmann::json;
#endif
#else
#include "external/json.hpp"
using json = nlohmann::json;
#endif

namespace Config {

// === Global Configuration Instances ===
Directories dirs;
NetworkConfig network;
IPFSConfig ipfs;
EncryptionConfig encryption;
LoggingConfig logging;
CacheConfig cache;
DevelopmentConfig development;
SecurityConfig security;
PerformanceConfig performance;

// === Configuration Management ===

void initialize_config() {
    // Create necessary directories
    std::vector<std::string> required_dirs = {
        dirs.get_config_path(),
        dirs.get_keys_path(),
        dirs.get_logs_path(),
        dirs.get_cache_path(),
        dirs.get_test_data_path(),
        dirs.get_build_path(),
        dirs.get_bin_path(),
        dirs.get_deps_path(),
        dirs.get_external_path()
    };
    
    for (const auto& dir : required_dirs) {
        ensure_directory_exists(dir);
    }
    
    // Load configuration from file if exists
    std::string config_file = dirs.get_config_path() + "/settings.json";
    if (std::filesystem::exists(config_file)) {
        load_config_from_file(config_file);
    } else {
        create_default_config();
    }
    
    // Validate configuration
    if (!validate_config()) {
        std::cerr << "Configuration validation failed!" << std::endl;
        exit(1);
    }
}

void load_config_from_file(const std::string& config_file) {
    try {
        std::ifstream file(config_file);
        if (!file.is_open()) {
            std::cerr << "Failed to open config file: " << config_file << std::endl;
            return;
        }
        
        json config;
        file >> config;
        file.close();
        
        // Load network configuration
        if (config.contains("network")) {
            auto& net = config["network"];
            if (net.contains("default_host")) network.default_host = net["default_host"];
            if (net.contains("default_port")) network.default_port = net["default_port"];
            if (net.contains("connection_timeout")) network.connection_timeout = net["connection_timeout"];
            if (net.contains("max_retries")) network.max_retries = net["max_retries"];
            if (net.contains("buffer_size")) network.buffer_size = net["buffer_size"];
            if (net.contains("max_connections")) network.max_connections = net["max_connections"];
            if (net.contains("thread_pool_size")) network.thread_pool_size = net["thread_pool_size"];
            if (net.contains("enable_ssl")) network.enable_ssl = net["enable_ssl"];
            if (net.contains("cert_file")) network.cert_file = net["cert_file"];
            if (net.contains("key_file")) network.key_file = net["key_file"];
            if (net.contains("ca_file")) network.ca_file = net["ca_file"];
        }
        
        // Load IPFS configuration
        if (config.contains("ipfs")) {
            auto& ipfs_config = config["ipfs"];
            if (ipfs_config.contains("api_url")) ipfs.api_url = ipfs_config["api_url"];
            if (ipfs_config.contains("gateway_url")) ipfs.gateway_url = ipfs_config["gateway_url"];
            if (ipfs_config.contains("ipns_key_name")) ipfs.ipns_key_name = ipfs_config["ipns_key_name"];
            if (ipfs_config.contains("timeout")) ipfs.timeout = ipfs_config["timeout"];
            if (ipfs_config.contains("max_retries")) ipfs.max_retries = ipfs_config["max_retries"];
            if (ipfs_config.contains("allow_offline")) ipfs.allow_offline = ipfs_config["allow_offline"];
        }
        
        // Load encryption configuration
        if (config.contains("encryption")) {
            auto& enc = config["encryption"];
            if (enc.contains("default_cipher")) encryption.default_cipher = enc["default_cipher"];
            if (enc.contains("key_size")) encryption.key_size = enc["key_size"];
            if (enc.contains("iv_size")) encryption.iv_size = enc["iv_size"];
            if (enc.contains("tag_size")) encryption.tag_size = enc["tag_size"];
            if (enc.contains("private_key_file")) encryption.private_key_file = enc["private_key_file"];
            if (enc.contains("password_file")) encryption.password_file = enc["password_file"];
            if (enc.contains("ipns_key_file")) encryption.ipns_key_file = enc["ipns_key_file"];
            if (enc.contains("rsa_key_size")) encryption.rsa_key_size = enc["rsa_key_size"];
        }
        
        // Load logging configuration
        if (config.contains("logging")) {
            auto& log = config["logging"];
            if (log.contains("log_file")) logging.log_file = log["log_file"];
            if (log.contains("log_level")) logging.log_level = log["log_level"];
            if (log.contains("max_log_size")) logging.max_log_size = log["max_log_size"];
            if (log.contains("max_log_files")) logging.max_log_files = log["max_log_files"];
            if (log.contains("enable_console")) logging.enable_console = log["enable_console"];
            if (log.contains("enable_file")) logging.enable_file = log["enable_file"];
        }
        
        // Load cache configuration
        if (config.contains("cache")) {
            auto& cache_config = config["cache"];
            if (cache_config.contains("ttl")) cache.ttl = cache_config["ttl"];
            if (cache_config.contains("max_size")) cache.max_size = cache_config["max_size"];
            if (cache_config.contains("enable_compression")) cache.enable_compression = cache_config["enable_compression"];
            if (cache_config.contains("cache_dir")) cache.cache_dir = cache_config["cache_dir"];
        }
        
        // Load development configuration
        if (config.contains("development")) {
            auto& dev = config["development"];
            if (dev.contains("debug_mode")) development.debug_mode = dev["debug_mode"];
            if (dev.contains("verbose_output")) development.verbose_output = dev["verbose_output"];
            if (dev.contains("enable_tests")) development.enable_tests = dev["enable_tests"];
            if (dev.contains("test_data_dir")) development.test_data_dir = dev["test_data_dir"];
            if (dev.contains("enable_profiling")) development.enable_profiling = dev["enable_profiling"];
            if (dev.contains("enable_benchmarks")) development.enable_benchmarks = dev["enable_benchmarks"];
            if (dev.contains("benchmark_iterations")) development.benchmark_iterations = dev["benchmark_iterations"];
        }
        
        // Load security configuration
        if (config.contains("security")) {
            auto& sec = config["security"];
            if (sec.contains("enable_audit_logging")) security.enable_audit_logging = sec["enable_audit_logging"];
            if (sec.contains("enable_threat_detection")) security.enable_threat_detection = sec["enable_threat_detection"];
            if (sec.contains("enable_pattern_matching")) security.enable_pattern_matching = sec["enable_pattern_matching"];
            if (sec.contains("max_failed_attempts")) security.max_failed_attempts = sec["max_failed_attempts"];
            if (sec.contains("lockout_duration")) security.lockout_duration = sec["lockout_duration"];
            if (sec.contains("enable_rate_limiting")) security.enable_rate_limiting = sec["enable_rate_limiting"];
            if (sec.contains("rate_limit_requests")) security.rate_limit_requests = sec["rate_limit_requests"];
            if (sec.contains("rate_limit_window")) security.rate_limit_window = sec["rate_limit_window"];
        }
        
        // Load performance configuration
        if (config.contains("performance")) {
            auto& perf = config["performance"];
            if (perf.contains("thread_pool_size")) performance.thread_pool_size = perf["thread_pool_size"];
            if (perf.contains("max_connections")) performance.max_connections = perf["max_connections"];
            if (perf.contains("buffer_size")) performance.buffer_size = perf["buffer_size"];
            if (perf.contains("queue_size")) performance.queue_size = perf["queue_size"];
            if (perf.contains("enable_async_io")) performance.enable_async_io = perf["enable_async_io"];
            if (perf.contains("io_timeout")) performance.io_timeout = perf["io_timeout"];
            if (perf.contains("enable_connection_pooling")) performance.enable_connection_pooling = perf["enable_connection_pooling"];
            if (perf.contains("pool_size")) performance.pool_size = perf["pool_size"];
        }
        
        std::cout << "Configuration loaded from: " << config_file << std::endl;
        
    } catch (const std::exception& e) {
        std::cerr << "Error loading configuration: " << e.what() << std::endl;
    }
}

void save_config_to_file(const std::string& config_file) {
    try {
        json config;
        
        // Network configuration
        config["network"] = {
            {"default_host", network.default_host},
            {"default_port", network.default_port},
            {"connection_timeout", network.connection_timeout},
            {"max_retries", network.max_retries},
            {"buffer_size", network.buffer_size},
            {"max_connections", network.max_connections},
            {"thread_pool_size", network.thread_pool_size},
            {"enable_ssl", network.enable_ssl},
            {"cert_file", network.cert_file},
            {"key_file", network.key_file},
            {"ca_file", network.ca_file}
        };
        
        // IPFS configuration
        config["ipfs"] = {
            {"api_url", ipfs.api_url},
            {"gateway_url", ipfs.gateway_url},
            {"ipns_key_name", ipfs.ipns_key_name},
            {"timeout", ipfs.timeout},
            {"max_retries", ipfs.max_retries},
            {"allow_offline", ipfs.allow_offline}
        };
        
        // Encryption configuration
        config["encryption"] = {
            {"default_cipher", encryption.default_cipher},
            {"key_size", encryption.key_size},
            {"iv_size", encryption.iv_size},
            {"tag_size", encryption.tag_size},
            {"private_key_file", encryption.private_key_file},
            {"password_file", encryption.password_file},
            {"ipns_key_file", encryption.ipns_key_file},
            {"rsa_key_size", encryption.rsa_key_size}
        };
        
        // Logging configuration
        config["logging"] = {
            {"log_file", logging.log_file},
            {"log_level", logging.log_level},
            {"max_log_size", logging.max_log_size},
            {"max_log_files", logging.max_log_files},
            {"enable_console", logging.enable_console},
            {"enable_file", logging.enable_file}
        };
        
        // Cache configuration
        config["cache"] = {
            {"ttl", cache.ttl},
            {"max_size", cache.max_size},
            {"enable_compression", cache.enable_compression},
            {"cache_dir", cache.cache_dir}
        };
        
        // Development configuration
        config["development"] = {
            {"debug_mode", development.debug_mode},
            {"verbose_output", development.verbose_output},
            {"enable_tests", development.enable_tests},
            {"test_data_dir", development.test_data_dir},
            {"enable_profiling", development.enable_profiling},
            {"enable_benchmarks", development.enable_benchmarks},
            {"benchmark_iterations", development.benchmark_iterations}
        };
        
        // Security configuration
        config["security"] = {
            {"enable_audit_logging", security.enable_audit_logging},
            {"enable_threat_detection", security.enable_threat_detection},
            {"enable_pattern_matching", security.enable_pattern_matching},
            {"max_failed_attempts", security.max_failed_attempts},
            {"lockout_duration", security.lockout_duration},
            {"enable_rate_limiting", security.enable_rate_limiting},
            {"rate_limit_requests", security.rate_limit_requests},
            {"rate_limit_window", security.rate_limit_window}
        };
        
        // Performance configuration
        config["performance"] = {
            {"thread_pool_size", performance.thread_pool_size},
            {"max_connections", performance.max_connections},
            {"buffer_size", performance.buffer_size},
            {"queue_size", performance.queue_size},
            {"enable_async_io", performance.enable_async_io},
            {"io_timeout", performance.io_timeout},
            {"enable_connection_pooling", performance.enable_connection_pooling},
            {"pool_size", performance.pool_size}
        };
        
        // Ensure directory exists
        std::filesystem::path config_path(config_file);
        std::filesystem::create_directories(config_path.parent_path());
        
        // Write to file
        std::ofstream file(config_file);
        if (file.is_open()) {
            file << config.dump(2);
            file.close();
            std::cout << "Configuration saved to: " << config_file << std::endl;
        } else {
            std::cerr << "Failed to save configuration to: " << config_file << std::endl;
        }
        
    } catch (const std::exception& e) {
        std::cerr << "Error saving configuration: " << e.what() << std::endl;
    }
}

void create_default_config() {
    std::cout << "Creating default configuration..." << std::endl;
    save_config_to_file();
}

// === Utility Functions ===

std::string get_project_root() {
    return dirs.project_root;
}

std::string get_absolute_path(const std::string& relative_path) {
    return dirs.project_root + "/" + relative_path;
}

bool ensure_directory_exists(const std::string& path) {
    try {
        if (!std::filesystem::exists(path)) {
            std::filesystem::create_directories(path);
            std::cout << "Created directory: " << path << std::endl;
        }
        return true;
    } catch (const std::exception& e) {
        std::cerr << "Failed to create directory " << path << ": " << e.what() << std::endl;
        return false;
    }
}

std::vector<std::string> get_environment_paths() {
    std::vector<std::string> paths;
    
    // Add current directory
    paths.push_back(".");
    
    // Add project directories
    paths.push_back(dirs.get_src_path());
    paths.push_back(dirs.get_include_path());
    paths.push_back(dirs.get_build_path());
    paths.push_back(dirs.get_bin_path());
    paths.push_back(dirs.get_keys_path());
    paths.push_back(dirs.get_config_path());
    paths.push_back(dirs.get_logs_path());
    paths.push_back(dirs.get_cache_path());
    
    // Add external directory
    paths.push_back(dirs.get_external_path());
    
    return paths;
}

// === Validation Functions ===

bool validate_config() {
    bool valid = true;
    
    // Validate network configuration
    if (network.default_port <= 0 || network.default_port > 65535) {
        std::cerr << "Invalid port number: " << network.default_port << std::endl;
        valid = false;
    }
    
    if (network.connection_timeout <= 0) {
        std::cerr << "Invalid connection timeout: " << network.connection_timeout << std::endl;
        valid = false;
    }
    
    if (network.max_retries < 0) {
        std::cerr << "Invalid max retries: " << network.max_retries << std::endl;
        valid = false;
    }
    
    // Validate IPFS configuration
    if (ipfs.timeout <= 0) {
        std::cerr << "Invalid IPFS timeout: " << ipfs.timeout << std::endl;
        valid = false;
    }
    
    // Validate encryption configuration
    if (encryption.key_size <= 0) {
        std::cerr << "Invalid key size: " << encryption.key_size << std::endl;
        valid = false;
    }
    
    if (encryption.iv_size <= 0) {
        std::cerr << "Invalid IV size: " << encryption.iv_size << std::endl;
        valid = false;
    }
    
    // Validate logging configuration
    if (logging.max_log_size <= 0) {
        std::cerr << "Invalid max log size: " << logging.max_log_size << std::endl;
        valid = false;
    }
    
    if (logging.max_log_files <= 0) {
        std::cerr << "Invalid max log files: " << logging.max_log_files << std::endl;
        valid = false;
    }
    
    // Validate cache configuration
    if (cache.ttl <= 0) {
        std::cerr << "Invalid cache TTL: " << cache.ttl << std::endl;
        valid = false;
    }
    
    if (cache.max_size <= 0) {
        std::cerr << "Invalid cache max size: " << cache.max_size << std::endl;
        valid = false;
    }
    
    // Validate security configuration
    if (security.max_failed_attempts <= 0) {
        std::cerr << "Invalid max failed attempts: " << security.max_failed_attempts << std::endl;
        valid = false;
    }
    
    if (security.lockout_duration <= 0) {
        std::cerr << "Invalid lockout duration: " << security.lockout_duration << std::endl;
        valid = false;
    }
    
    if (security.rate_limit_requests <= 0) {
        std::cerr << "Invalid rate limit requests: " << security.rate_limit_requests << std::endl;
        valid = false;
    }
    
    if (security.rate_limit_window <= 0) {
        std::cerr << "Invalid rate limit window: " << security.rate_limit_window << std::endl;
        valid = false;
    }
    
    // Validate performance configuration
    if (performance.thread_pool_size <= 0) {
        std::cerr << "Invalid thread pool size: " << performance.thread_pool_size << std::endl;
        valid = false;
    }
    
    if (performance.max_connections <= 0) {
        std::cerr << "Invalid max connections: " << performance.max_connections << std::endl;
        valid = false;
    }
    
    if (performance.buffer_size <= 0) {
        std::cerr << "Invalid buffer size: " << performance.buffer_size << std::endl;
        valid = false;
    }
    
    if (performance.queue_size <= 0) {
        std::cerr << "Invalid queue size: " << performance.queue_size << std::endl;
        valid = false;
    }
    
    if (performance.io_timeout <= 0) {
        std::cerr << "Invalid IO timeout: " << performance.io_timeout << std::endl;
        valid = false;
    }
    
    if (performance.pool_size <= 0) {
        std::cerr << "Invalid pool size: " << performance.pool_size << std::endl;
        valid = false;
    }
    
    return valid;
}

bool check_required_files() {
    bool all_exist = true;
    
    // Check for required key files
    std::vector<std::string> required_files = {
        encryption.private_key_file,
        encryption.password_file,
        encryption.ipns_key_file
    };
    
    for (const auto& file : required_files) {
        if (!std::filesystem::exists(file)) {
            std::cerr << "Required file missing: " << file << std::endl;
            all_exist = false;
        }
    }
    
    return all_exist;
}

bool check_required_directories() {
    bool all_exist = true;
    
    std::vector<std::string> required_dirs = {
        dirs.get_config_path(),
        dirs.get_keys_path(),
        dirs.get_logs_path(),
        dirs.get_cache_path(),
        dirs.get_build_path(),
        dirs.get_bin_path()
    };
    
    for (const auto& dir : required_dirs) {
        if (!std::filesystem::exists(dir)) {
            std::cerr << "Required directory missing: " << dir << std::endl;
            all_exist = false;
        }
    }
    
    return all_exist;
}

bool check_ipfs_installation() {
    // Check if IPFS is available in PATH
    FILE* pipe = popen("which ipfs", "r");
    if (!pipe) return false;
    
    char buffer[128];
    std::string result = "";
    while (!feof(pipe)) {
        if (fgets(buffer, 128, pipe) != NULL)
            result += buffer;
    }
    pclose(pipe);
    
    return !result.empty();
}

bool check_system_dependencies() {
    bool all_available = true;
    
    // Check for required system libraries
    std::vector<std::string> libraries = {"libcurl", "libssl", "libcrypto"};
    
    for (const auto& lib : libraries) {
        std::string cmd = "pkg-config --exists " + lib;
        if (system(cmd.c_str()) != 0) {
            std::cerr << "System library missing: " << lib << std::endl;
            all_available = false;
        }
    }
    
    return all_available;
}

// === Configuration Getters ===

template<typename T>
T get_config_value(const std::string& key, const T& default_value) {
    // This is a simplified implementation
    // In a real implementation, you would parse the key and return the appropriate value
    return default_value;
}

template<typename T>
void set_config_value(const std::string& key, const T& value) {
    // This is a simplified implementation
    // In a real implementation, you would parse the key and set the appropriate value
}

// Template instantiations
template std::string get_config_value<std::string>(const std::string&, const std::string&);
template int get_config_value<int>(const std::string&, const int&);
template bool get_config_value<bool>(const std::string&, const bool&);
template void set_config_value<std::string>(const std::string&, const std::string&);
template void set_config_value<int>(const std::string&, const int&);
template void set_config_value<bool>(const std::string&, const bool&);

} // namespace Config 