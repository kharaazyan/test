#include "cli.hpp"
#include "fetcher.hpp"
#include "decryptor.hpp"
#include "utils.hpp"
#include <fstream>
#include <iostream>
#include <filesystem>
#include <cstdlib>
#include <thread>
#include <chrono>
#include "termcolor/termcolor.hpp"
#include "json.hpp"

using json = nlohmann::json;
namespace fs = std::filesystem;

// Resolves IPNS peer name read from keys/ipns_key.txt to a CID
std::string resolveIPNSKey() {
    const std::string keyFilePath = "./keys/ipns_key.txt";

    std::ifstream keyFile(keyFilePath);
    if (!keyFile.is_open()) {
        throw std::runtime_error("Cannot open IPNS key file: " + keyFilePath);
    }

    std::string peerName;
    std::getline(keyFile, peerName);
    keyFile.close();

    if (peerName.empty()) {
        throw std::runtime_error("IPNS key file is empty");
    }

    std::string command = "ipfs name resolve --nocache /ipns/" + peerName + " --timeout=5s";
    std::string cid;
    FILE *pipe = popen(command.c_str(), "r");
    if (!pipe) {
        throw std::runtime_error("Failed to run IPNS resolve command");
    }

    char buffer[256];
    while (fgets(buffer, sizeof(buffer), pipe)) {
        cid += buffer;
    }
    pclose(pipe);

    const std::string prefix = "/ipfs/";
    auto pos = cid.find(prefix);
    if (pos != std::string::npos) {
        cid = cid.substr(pos + prefix.size());
        cid.erase(cid.find_last_not_of(" \n\r\t") + 1);
    } else {
        throw std::runtime_error("Could not parse IPNS resolve output");
    }

    return cid;
}

// Экранирование пробелов в пути
std::string escapePath(const std::string& path) {
    std::string escaped;
    for (char c : path) {
        if (c == ' ') {
            escaped += "\\ ";
        } else {
            escaped += c;
        }
    }
    return escaped;
}

// Запуск веб-сервера
void startWebServer() {
    fs::path currentPath = fs::current_path();
    fs::path webDir = currentPath / "web";
    fs::path backendDir = webDir / "backend";
    fs::path frontendDir = webDir / "frontend";
    
    // Запускаем backend
    std::string backendCmd = "cd '" + backendDir.string() + "' && npm run start &";
    system(backendCmd.c_str());
    
    // Даем время на запуск backend
    std::this_thread::sleep_for(std::chrono::seconds(2));
    
    // Запускаем frontend
    std::string frontendCmd = "cd '" + frontendDir.string() + "' && npm run preview &";
    system(frontendCmd.c_str());
    
    // Даем время на запуск frontend
    std::this_thread::sleep_for(std::chrono::seconds(2));
}

// Остановка веб-сервера
void stopWebServer() {
    system("pkill -f 'node.*backend'");
    system("pkill -f 'vite.*preview'");
}

void CLI::run()
{
    std::cout << termcolor::bold << termcolor::cyan;
    std::cout << "\n";
    std::cout << "               ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗\n";
    std::cout << "               ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝\n";
    std::cout << "               ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗\n";
    std::cout << "               ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║\n";
    std::cout << "               ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║\n";
    std::cout << "               ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝\n";
    std::cout << "\n";
    std::cout << termcolor::reset;
    std::cout << termcolor::yellow << "═════════════════════════════════════════════════════════════════════════\n";
    std::cout << "         🚀 Secure Log Management System | IPFS-Powered Analytics\n";
    std::cout << "═════════════════════════════════════════════════════════════════════════\n" << termcolor::reset;
    std::cout << termcolor::green << "\nWelcome to Nexus CLI - Type 'help' for available commands\n" << termcolor::reset;
    std::cout << "\n";

    // Автоматически запускаем веб-интерфейс при старте
    startWebServer();


    std::string command;

    while (true)
    {
        std::cout << termcolor::green << "logcli> " << termcolor::reset;
        std::getline(std::cin, command);

        if (command == "fetch --resolve")
        {
            try {
                std::string resolvedCID = resolveIPNSKey();
                std::cout << termcolor::green << "[✓] Resolved CID: " << resolvedCID << "\n" << termcolor::reset;
                lastPrevCID = resolvedCID;  // update lastPrevCID but do NOT fetch logs
            } catch (const std::exception& e) {
                std::cerr << termcolor::red << "Resolve error: " << e.what() << "\n" << termcolor::reset;
            }
        }
        else if (command == "fetch --chain")
        {
            if (lastPrevCID.empty())
            {
                std::cout << termcolor::red << "No previous logs.\n" << termcolor::reset;
            }
            else
            {
                loadCID(lastPrevCID);
            }
        }
        else if (command.size() >= 6 && command.substr(0,6) == "fetch ")
        {
            std::string cid = command.substr(6);
            if (cid.empty()) {
                std::cout << termcolor::yellow << "Please provide a CID after 'fetch'.\n" << termcolor::reset;
            } else {
                loadCID(cid);
            }
        }
        else if (command == "web start" || command == "web")
        {
            startWebServer();
        }
        else if (command == "web stop")
        {
            stopWebServer();
            std::cout << termcolor::cyan << "Web interface stopped\n" << termcolor::reset;
        }
        else if (command == "exit")
        {
            stopWebServer();
            break;
        }
        else
        {
            std::cout << termcolor::yellow << "╔═════════════════════════════════════════════════════════════════╗\n";
            std::cout << "║                        Available Commands                       ║\n";
            std::cout << "╠═════════════════════════════════════════════════════════════════╣\n";
            std::cout << "║  fetch --resolve       Resolve IPNS and show latest CID         ║\n";
            std::cout << "║  fetch <CID>           Fetch and decrypt a specific CID         ║\n";
            std::cout << "║  fetch --chain         Fetch previous logs from last prev_cid   ║\n";
            std::cout << "║  web                   Start web interface                      ║\n";
            std::cout << "║  web stop              Stop web interface                       ║\n";
            std::cout << "║  help / ?              Show this help message                   ║\n";
            std::cout << "║  exit / quit           Exit the application                     ║\n";
            std::cout << "╚═════════════════════════════════════════════════════════════════╝\n" << termcolor::reset;
        }
    }
}

void CLI::loadCID(const std::string &cid)
{
    try
    {
        std::string raw = fetchFromIPFS(cid);

        json j;
        try
        {
            j = decryptAndParse(raw, "./keys/private_key.pem");
        }
        catch (const json::parse_error &e)
        {
            std::cerr << termcolor::red
                      << "[✘] Error: Response was not valid JSON — possibly invalid CID or IPFS error.\n"
                      << "[Raw Response]\n" << raw << "\n"
                      << termcolor::reset;
            return;
        }
        catch (const std::exception &e)
        {
            std::cerr << termcolor::red
                      << "[✘] Error during decryption: " << e.what() << "\n"
                      << termcolor::reset;
            return;
        }

        std::vector<json> logs = parseAndSortLogs(j["logs"]);
        lastPrevCID = j.value("prev_cid", "");

        std::ofstream fout("./logs_output.jsonl", std::ios::app);
        if (!fout.is_open())
        {
            throw std::runtime_error("Cannot open output file");
        }

        std::cout << termcolor::green << "=== Decrypted Logs ===\n" << termcolor::reset;

        for (const auto &log : logs)
        {
            std::cout << termcolor::yellow << "┌─────────────────────────────────────\n";
            std::cout << "│ Event ID : " << log["event_id"] << "\n"
                      << "│ Type     : " << log["type"] << "\n"
                      << "│ Message  : " << log["message"] << "\n";
            if (log.contains("timestamp"))
            {
                std::cout << "│ Time     : " << log["timestamp"] << "\n";
            }
            std::cout << "└─────────────────────────────────────" << termcolor::reset << "\n";

            fout << log.dump(4) << "\n\n";
        }

        fout.close();

        std::cout << termcolor::cyan << "⬅️  prev_cid: " << lastPrevCID << "\n" << termcolor::reset;

        if (lastPrevCID.empty())
        {
            std::cout << termcolor::cyan << "✔️  No more logs.\n" << termcolor::reset;
        }
        else
        {
            std::cout << termcolor::cyan << "➡️  Type 'fetch --chain' to load more logs...\n" << termcolor::reset;
        }
    }
    catch (const std::exception &e)
    {
        std::cerr << termcolor::red << "[✘] Error: " << e.what() << termcolor::reset << "\n";
    }
}

