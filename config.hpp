#pragma once

#include <string>
#include <vector>
#include <map>
#include <optional>
#include <filesystem>

namespace Config {
    // === Project Metadata ===
    constexpr const char* PROJECT_NAME = "CLI-NetSecTool";
    constexpr const char* VERSION = "2.0.0";
    
    // === Build Configuration ===
    constexpr bool DEBUG_MODE = false;
    constexpr bool VERBOSE_LOGGING = false;
    
    // === Directory Structure ===
    struct Directories {
        std::string project_root;
        std::string src_dir = "src";
        std::string include_dir = "include";
        std::string build_dir = "build";
        std::string bin_dir = "bin";
        std::string dist_dir = "dist";
        std::string deps_dir = "deps";
        std::string external_dir = "external";
        std::string keys_dir = "keys";
        std::string config_dir = "config";
        std::string logs_dir = "logs";
        std::string cache_dir = "cache";
        std::string test_data_dir = "test_data";
        
        Directories() {
            // Auto-detect project root
            project_root = std::filesystem::current_path().string();
        }
        
        std::string get_src_path() const { return project_root + "/" + src_dir; }
        std::string get_include_path() const { return project_root + "/" + include_dir; }
        std::string get_build_path() const { return project_root + "/" + build_dir; }
        std::string get_bin_path() const { return project_root + "/" + bin_dir; }
        std::string get_keys_path() const { return project_root + "/" + keys_dir; }
        std::string get_config_path() const { return project_root + "/" + config_dir; }
        std::string get_logs_path() const { return project_root + "/" + logs_dir; }
        std::string get_cache_path() const { return project_root + "/" + cache_dir; }
    };
    
    // === Network Configuration ===
    struct NetworkConfig {
        std::string default_host = "127.0.0.1";
        int default_port = 8080;
        int connection_timeout = 10;
        int max_retries = 3;
        int buffer_size = 8192;
        int max_connections = 100;
        int thread_pool_size = 4;
        
        // SSL/TLS Configuration
        bool enable_ssl = true;
        std::string cert_file = "certs/server.crt";
        std::string key_file = "certs/server.key";
        std::string ca_file = "certs/ca.crt";
    };
    
    // === IPFS Configuration ===
    struct IPFSConfig {
        std::string api_url = "http://localhost:5001";
        std::string gateway_url = "http://localhost:8080";
        std::string ipns_key_name = "cli-netsectool";
        int timeout = 30;
        int max_retries = 3;
        bool allow_offline = true;
        
        // IPFS URLs for installation
        constexpr static const char* IPFS_DOWNLOAD_URL = "https://dist.ipfs.tech/kubo/v0.20.0/kubo_v0.20.0_linux-amd64.tar.gz";
        constexpr static const char* NLOHMANN_JSON_URL = "https://github.com/nlohmann/json/releases/download/v3.12.0/json.hpp";
        constexpr static const char* SPDLOG_URL = "https://github.com/gabime/spdlog/releases/download/v1.12.0/spdlog.hpp";
    };
    
    // === Encryption Configuration ===
    struct EncryptionConfig {
        std::string default_cipher = "AES-256-GCM";
        int key_size = 32;
        int iv_size = 12;
        int tag_size = 16;
        std::string private_key_file = "keys/private_key.zip";
        std::string password_file = "keys/p.zip";
        std::string ipns_key_file = "keys/ipns_key.txt";
        
        // RSA Configuration
        int rsa_key_size = 2048;
        constexpr static const char* RSA_PADDING = "RSA_PKCS1_OAEP_PADDING";
    };
    
    // === Logging Configuration ===
    struct LoggingConfig {
        std::string log_file = "logs/cli-netsectool.log";
        std::string log_level = "INFO";
        int max_log_size = 10 * 1024 * 1024; // 10MB
        int max_log_files = 5;
        bool enable_console = true;
        bool enable_file = true;
        
        // Log patterns
        std::vector<std::string> default_patterns = {
            "ERROR",
            "WARNING", 
            "CRITICAL",
            "authentication failed",
            "permission denied",
            "unauthorized access",
            "failed login",
            "buffer overflow",
            "segfault",
            "malware",
            "virus",
            "trojan",
            "backdoor",
            "rootkit",
            "connection refused",
            "access denied",
            "root access",
            "port scan",
            "malware detected",
            "invalid user",
            "ssh login failed",
            "brute force",
            "intrusion detected",
            "firewall drop",
            "selinux violation",
            "audit failure",
            "kernel panic",
            "oom-killer",
            "disk failure",
            "i/o error",
            "filesystem error",
            "mount failure",
            "device not ready",
            "usb disconnect",
            "usb device added",
            "network unreachable",
            "no route to host",
            "packet loss",
            "connection timeout",
            "scan detected",
            "rejected",
            "blacklisted",
            "iptables drop",
            "kernel bug",
            "modprobe error",
            "service crash",
            "daemon died",
            "zombie process",
            "critical error",
            "fatal error",
            "systemd failure",
            "service failed",
            "watchdog timeout",
            "login rate limit",
            "tcp reset",
            "dns spoof",
            "suspicious activity",
            "invalid certificate",
            "certificate expired",
            "key mismatch",
            "ssh disconnect",
            "ssh key rejected",
            "ransomware",
            "phishing",
            "exploit",
            "heap corruption",
            "stack smash",
            "format string",
            "double free",
            "race condition",
            "memory leak",
            "unexpected reboot",
            "system halt",
            "service not found",
            "executable not found",
            "segmentation violation",
            "unknown device",
            "invalid configuration",
            "tampering",
            "configuration mismatch",
            "unexpected behavior",
            "error while loading shared libraries",
            "unable to resolve host",
            "failed to execute",
            "fork failed",
            "cannot allocate memory",
            "unhandled exception",
            "assertion failed",
            "invalid opcode",
            "illegal instruction",
            "trap divide error",
            "cpu soft lockup",
            "watchdog detected hard lockup",
            "clock skew",
            "time jump detected",
            "ntp error",
            "ntp time correction",
            "drift too large",
            "file not found",
            "no such file or directory",
            "read-only filesystem",
            "read error",
            "write error",
            "corrupted filesystem",
            "journal failure",
            "mounting failed",
            "disk quota exceeded",
            "inode exhaustion",
            "no space left on device",
            "device busy",
            "device error",
            "input/output error",
            "media failure",
            "firmware bug",
            "hardware error",
            "machine check error",
            "cpu overheating",
            "fan failure",
            "temperature threshold exceeded",
            "voltage out of range",
            "power supply failure",
            "battery failure",
            "acpi error",
            "bios error",
            "thermal event",
            "memory corruption",
            "dma error",
            "pci error",
            "usb enumeration failed",
            "device reset",
            "link down",
            "interface down",
            "interface reset",
            "network interface error",
            "packet corruption",
            "ip conflict",
            "dns error",
            "name resolution failure",
            "hostname lookup failure",
            "dhcp failure",
            "link flapping",
            "bridge loop detected",
            "network storm",
            "network congestion",
            "arp spoofing",
            "mac address conflict",
            "spoofed packet",
            "unexpected packet",
            "tcp handshake failed",
            "tcp retransmission",
            "ssl handshake failed",
            "tls alert",
            "tls negotiation failed",
            "certificate error",
            "expired certificate",
            "self-signed certificate",
            "untrusted certificate",
            "revoked certificate",
            "cipher mismatch",
            "invalid hostname",
            "proxy error",
            "vpn error",
            "tunnel failure",
            "ipsec negotiation failed",
            "route flapping",
            "routing table error",
            "bgp session dropped",
            "ospf adjacency lost",
            "icmp flood",
            "syn flood",
            "dos attack detected",
            "ddos attack",
            "malformed packet",
            "invalid header",
            "port unreachable",
            "service unavailable",
            "unknown protocol",
            "log tampering",
            "log rotation failed",
            "auditd buffer overflow",
            "selinux alert",
            "apparmor violation",
            "container exited unexpectedly",
            "container restart loop",
            "docker daemon error",
            "kubelet error",
            "kubernetes api error",
            "pod eviction",
            "taint detected",
            "node not ready",
            "kube-apiserver crash",
            "etcd connection failed"
        };
    };
    
    // === Cache Configuration ===
    struct CacheConfig {
        int ttl = 3600; // 1 hour
        int max_size = 100 * 1024 * 1024; // 100MB
        bool enable_compression = true;
        std::string cache_dir = "cache";
    };
    
    // === Development Configuration ===
    struct DevelopmentConfig {
        bool debug_mode = false;
        bool verbose_output = false;
        bool enable_tests = true;
        std::string test_data_dir = "test_data";
        
        // Performance monitoring
        bool enable_profiling = false;
        bool enable_benchmarks = false;
        int benchmark_iterations = 1000;
    };
    
    // === Security Configuration ===
    struct SecurityConfig {
        bool enable_audit_logging = true;
        bool enable_threat_detection = true;
        bool enable_pattern_matching = true;
        int max_failed_attempts = 5;
        int lockout_duration = 300; // 5 minutes
        bool enable_rate_limiting = true;
        int rate_limit_requests = 100;
        int rate_limit_window = 60; // 1 minute
    };
    
    // === Performance Configuration ===
    struct PerformanceConfig {
        int thread_pool_size = 4;
        int max_connections = 100;
        int buffer_size = 8192;
        int queue_size = 16384;
        bool enable_async_io = true;
        int io_timeout = 30;
        bool enable_connection_pooling = true;
        int pool_size = 10;
    };
    
    // === Global Configuration Instance ===
    extern Directories dirs;
    extern NetworkConfig network;
    extern IPFSConfig ipfs;
    extern EncryptionConfig encryption;
    extern LoggingConfig logging;
    extern CacheConfig cache;
    extern DevelopmentConfig development;
    extern SecurityConfig security;
    extern PerformanceConfig performance;
    
    // === Configuration Management Functions ===
    void initialize_config();
    void load_config_from_file(const std::string& config_file = "config/settings.json");
    void save_config_to_file(const std::string& config_file = "config/settings.json");
    void create_default_config();
    
    // === Utility Functions ===
    std::string get_project_root();
    std::string get_absolute_path(const std::string& relative_path);
    bool ensure_directory_exists(const std::string& path);
    std::vector<std::string> get_environment_paths();
    
    // === Validation Functions ===
    bool validate_config();
    bool check_required_files();
    bool check_required_directories();
    bool check_ipfs_installation();
    bool check_system_dependencies();
    
    // === Configuration Getters ===
    template<typename T>
    T get_config_value(const std::string& key, const T& default_value);
    
    template<typename T>
    void set_config_value(const std::string& key, const T& value);
} 