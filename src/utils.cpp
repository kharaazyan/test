#include "utils.hpp"
#include <openssl/bio.h>
#include <openssl/evp.h>
#include <openssl/buffer.h>
#include "json.hpp"
#include <algorithm>

std::vector<unsigned char> base64Decode(const std::string& input) {
    BIO* bio = BIO_new_mem_buf(input.data(), input.size());
    BIO* b64 = BIO_new(BIO_f_base64());
    BIO_set_flags(b64, BIO_FLAGS_BASE64_NO_NL);
    bio = BIO_push(b64, bio);

    std::vector<unsigned char> output(input.size());
    int len = BIO_read(bio, output.data(), input.size());
    output.resize(len);

    BIO_free_all(bio);
    return output;
}

std::vector<nlohmann::json> parseAndSortLogs(const nlohmann::json& logsArray) {
    std::vector<nlohmann::json> logs;
    for (const auto& s : logsArray) {
        logs.push_back(nlohmann::json::parse(s.get<std::string>()));
    }
    std::sort(logs.begin(), logs.end(), [](const auto& a, const auto& b) {
        return a["event_id"] > b["event_id"];
    });
    return logs;
}
