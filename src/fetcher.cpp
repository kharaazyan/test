#include "fetcher.hpp"
#include <curl/curl.h>
#include <stdexcept>


static size_t WriteCallback(void* contents, size_t size, size_t nmemb, std::string* output) {
    size_t total = size * nmemb;
    output->append((char*)contents, total);
    return total;
}

std::string fetchFromIPFS(const std::string& cid) {
    CURL* curl = curl_easy_init();
    std::string response;
    std::string url = "https://ipfs.io/ipfs/" + cid;

    if (curl) {
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
        CURLcode res = curl_easy_perform(curl);
        if (res != CURLE_OK) {
            curl_easy_cleanup(curl);
            throw std::runtime_error("Failed to fetch from IPFS");
        }
        curl_easy_cleanup(curl);
    } else {
        throw std::runtime_error("CURL init failed");
    }

    return response;
}
