#!/bin/bash

# CLI-NetSecTool Setup Script
# Advanced Network Security & Decryption Tool for DevHack 2025

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}CLI-NetSecTool Setup Script${NC}"
echo "=================================="
echo

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[ℹ]${NC} $1"
}

# Check if we're in the project directory
if [ ! -f "makefile" ]; then
    print_error "This script must be run from the CLI-NetSecTool project directory"
    exit 1
fi

# Step 1: Install system dependencies
print_status "Installing system dependencies..."
sudo apt-get update
sudo apt-get install -y build-essential curl wget git pkg-config
sudo apt-get install -y libcurl4-openssl-dev libssl-dev libcrypto++-dev
sudo apt-get install -y libspdlog-dev nlohmann-json3-dev
sudo apt-get install -y libboost-all-dev libsystemd-dev

# Step 2: Build the project
print_status "Building the project..."
make clean-all
make deps
make main

# Step 3: Generate configuration
print_status "Generating configuration..."
if [ -f "./bin/config_generator" ]; then
    ./bin/config_generator
else
    print_warning "Config generator not found, creating basic configuration..."
    mkdir -p config
    mkdir -p keys
    mkdir -p logs
    mkdir -p cache
    mkdir -p test_data
    mkdir -p certs
fi

# Step 4: Generate cryptographic keys if they don't exist
if [ ! -f "keys/private_key.zip" ]; then
    print_status "Generating cryptographic keys..."
    mkdir -p keys
    
    # Generate RSA key pair
    openssl genrsa -out keys/private_key.pem 2048
    openssl rsa -in keys/private_key.pem -pubout -out keys/public_key.pem
    
    # Create password file
    echo "cli-netsectool-password-2025" > keys/password.txt
    
    # Create encrypted key files
    zip -P "cli-netsectool-secure-2025" keys/private_key.zip keys/private_key.pem
    zip -P "cli-netsectool-secure-2025" keys/p.zip keys/password.txt
    
    # Set proper permissions
    chmod 600 keys/private_key.pem
    chmod 644 keys/public_key.pem
    chmod 600 keys/private_key.zip
    chmod 600 keys/p.zip
    
    # Clean up temporary files
    rm -f keys/private_key.pem keys/password.txt
    
    print_status "Cryptographic keys generated successfully"
else
    print_status "Cryptographic keys already exist"
fi

# Step 5: Check IPFS installation
print_status "Checking IPFS installation..."
if ! command -v ipfs &> /dev/null; then
    print_warning "IPFS not found. Installing IPFS..."
    
    # Download and install IPFS
    IPFS_VERSION="v0.20.0"
    IPFS_URL="https://dist.ipfs.tech/kubo/${IPFS_VERSION}/kubo_${IPFS_VERSION}_linux-amd64.tar.gz"
    
    cd deps
    wget -q "$IPFS_URL" -O ipfs.tar.gz
    tar -xzf ipfs.tar.gz
    sudo cp kubo/ipfs /usr/local/bin/
    rm -rf kubo ipfs.tar.gz
    cd ..
    rm -rf deps
    
    print_status "IPFS installed successfully"
else
    print_status "IPFS already installed"
fi

# Step 6: Initialize IPFS if not already done
if [ ! -d "$HOME/.ipfs" ]; then
    print_status "Initializing IPFS repository..."
    ipfs init
else
    print_status "IPFS repository already initialized"
fi

# Step 7: Generate IPFS key if it doesn't exist
print_status "Checking IPFS key..."
if ! ipfs key list | grep -q "cli-netsectool"; then
    print_status "Generating IPFS key for secure storage..."
    ipfs key gen cli-netsectool --type=rsa --size=2048
else
    print_status "IPFS key already exists"
fi

# Step 8: Create IPNS key file
print_status "Creating IPNS key file..."
if [ ! -f "keys/ipns_key.txt" ]; then
    ipfs key list | grep "cli-netsectool" | awk '{print $1}' > keys/ipns_key.txt
    chmod 600 keys/ipns_key.txt
    print_status "IPNS key file created"
else
    print_status "IPNS key file already exists"
fi

# Step 9: Create default pattern file
print_status "Creating default security patterns..."
mkdir -p test_data
cat > test_data/patterns.txt << 'EOF'
# Security Event Patterns for CLI-NetSecTool
ERROR
WARNING
CRITICAL
authentication failed
permission denied
unauthorized access
failed login
buffer overflow
segfault
malware
virus
trojan
backdoor
rootkit
connection refused
access denied
root access
port scan
malware detected
invalid user
ssh login failed
brute force
intrusion detected
firewall drop
selinux violation
audit failure
kernel panic
oom-killer
disk failure
i/o error
filesystem error
mount failure
device not ready
usb disconnect
usb device added
network unreachable
no route to host
packet loss
connection timeout
scan detected
rejected
blacklisted
iptables drop
kernel bug
modprobe error
service crash
daemon died
zombie process
critical error
fatal error
systemd failure
service failed
watchdog timeout
login rate limit
tcp reset
dns spoof
suspicious activity
invalid certificate
certificate expired
key mismatch
ssh disconnect
ssh key rejected
ransomware
phishing
exploit
heap corruption
stack smash
format string
double free
race condition
memory leak
unexpected reboot
system halt
service not found
executable not found
segmentation violation
unknown device
invalid configuration
tampering
configuration mismatch
unexpected behavior
error while loading shared libraries
unable to resolve host
failed to execute
fork failed
cannot allocate memory
unhandled exception
assertion failed
invalid opcode
illegal instruction
trap divide error
cpu soft lockup
watchdog detected hard lockup
clock skew
time jump detected
ntp error
ntp time correction
drift too large
file not found
no such file or directory
read-only filesystem
read error
write error
corrupted filesystem
journal failure
mounting failed
disk quota exceeded
inode exhaustion
no space left on device
device busy
device error
input/output error
media failure
firmware bug
hardware error
machine check error
cpu overheating
fan failure
temperature threshold exceeded
voltage out of range
power supply failure
battery failure
acpi error
bios error
thermal event
memory corruption
dma error
pci error
usb enumeration failed
device reset
link down
interface down
interface reset
network interface error
packet corruption
ip conflict
dns error
name resolution failure
hostname lookup failure
dhcp failure
link flapping
bridge loop detected
network storm
network congestion
arp spoofing
mac address conflict
spoofed packet
unexpected packet
tcp handshake failed
tcp retransmission
ssl handshake failed
tls alert
tls negotiation failed
certificate error
expired certificate
self-signed certificate
untrusted certificate
revoked certificate
cipher mismatch
invalid hostname
proxy error
vpn error
tunnel failure
ipsec negotiation failed
route flapping
routing table error
bgp session dropped
ospf adjacency lost
icmp flood
syn flood
dos attack detected
ddos attack
malformed packet
invalid header
port unreachable
service unavailable
unknown protocol
log tampering
log rotation failed
auditd buffer overflow
selinux alert
apparmor violation
container exited unexpectedly
container restart loop
docker daemon error
kubelet error
kubernetes api error
pod eviction
taint detected
node not ready
kube-apiserver crash
etcd connection failed
EOF

# Step 10: Create auto-clean script
print_status "Creating auto-clean script..."
cat > auto-clean.sh << 'EOF'
#!/bin/bash

# Auto-clean script for CLI-NetSecTool
# Removes temporary files and build artifacts

set -e

echo "🧹 Cleaning temporary files..."

# Remove build artifacts
rm -rf build/*

# Remove cache
rm -rf cache/*

# Remove temporary files
find . -name "*.tmp" -delete
find . -name "*.log" -delete
find . -name "*.o" -delete

# Remove deps (temporary directory)
rm -rf deps/*

echo "✅ Cleanup completed"
EOF

chmod +x auto-clean.sh
print_status "Auto-clean script created"

# Step 11: Set up systemd service (optional)
read -p "Do you want to set up systemd service for automatic startup? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Setting up systemd service..."
    
    # Create systemd service file
    sudo tee /etc/systemd/system/cli-netsectool.service > /dev/null << EOF
[Unit]
Description=CLI-NetSecTool Network Security & Decryption Tool
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
ExecStart=$(pwd)/bin/cli-netsectool
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

    # Reload systemd and enable service
    sudo systemctl daemon-reload
    sudo systemctl enable cli-netsectool.service
    
    print_status "Systemd service configured. Use 'sudo systemctl start cli-netsectool' to start"
fi

# Step 12: Create test data
print_status "Creating test data..."
mkdir -p test_data
cat > test_data/sample_logs.txt << 'EOF'
2024-01-15 10:30:15 ERROR authentication failed for user admin
2024-01-15 10:30:16 WARNING multiple failed login attempts detected
2024-01-15 10:30:17 CRITICAL unauthorized access attempt from 192.168.1.100
2024-01-15 10:30:18 ERROR permission denied for file /etc/shadow
2024-01-15 10:30:19 WARNING port scan detected from 10.0.0.50
2024-01-15 10:30:20 ERROR buffer overflow in process 1234
2024-01-15 10:30:21 CRITICAL malware detected: trojan.exe
2024-01-15 10:30:22 WARNING suspicious activity: multiple SSH connections
2024-01-15 10:30:23 ERROR firewall drop: blocked connection from 172.16.0.10
2024-01-15 10:30:24 CRITICAL kernel panic: out of memory
EOF

# Step 13: Create example configuration
print_status "Creating example configuration..."
cat > config/example-settings.json << 'EOF'
{
  "network": {
    "default_host": "0.0.0.0",
    "default_port": 8443,
    "enable_ssl": true
  },
  "logging": {
    "log_level": "DEBUG",
    "enable_console": true,
    "enable_file": true
  },
  "security": {
    "enable_threat_detection": true,
    "enable_pattern_matching": true,
    "max_failed_attempts": 3
  }
}
EOF

# Step 14: Final instructions
echo
echo -e "${GREEN}Setup completed successfully!${NC}"
echo
echo "🎯 CLI-NetSecTool is ready for DevHack 2025!"
echo
echo "Next steps:"
echo "1. Start IPFS daemon: ipfs daemon --routing=dhtclient"
echo "2. Run the tool: ./bin/cli-netsectool"
echo "3. Check logs: tail -f logs/cli-netsectool.log"
echo
echo "Configuration files:"
echo "- Main config: config/settings.json"
echo "- Example config: config/example-settings.json"
echo "- Security patterns: test_data/patterns.txt"
echo "- Cryptographic keys: keys/private_key.zip, keys/p.zip"
echo "- IPNS key: keys/ipns_key.txt"
echo
echo "Useful commands:"
echo "- View logs: tail -f logs/cli-netsectool.log"
echo "- Check IPFS status: ipfs id"
echo "- List IPFS keys: ipfs key list"
echo "- Clean temporary files: ./auto-clean.sh"
echo "- Monitor systemd service: sudo systemctl status cli-netsectool"
echo
echo "Development:"
echo "- Edit config/settings.json for configuration"
echo "- Add patterns to test_data/patterns.txt"
echo "- Run tests: make test"
echo "- Build: make all"
echo