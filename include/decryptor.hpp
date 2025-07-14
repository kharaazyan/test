#pragma once
#include <string>
#include "json.hpp"

nlohmann::json decryptAndParse(const std::string& jsonData, const std::string& privateKeyPath);
