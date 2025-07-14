#pragma once
#include <vector>
#include <string>
#include "json.hpp"

std::vector<unsigned char> base64Decode(const std::string& input);
std::vector<nlohmann::json> parseAndSortLogs(const nlohmann::json& logsArray);
