#include "decryptor.hpp"
#include "utils.hpp"
#include <openssl/pem.h>
#include <openssl/evp.h>
#include <openssl/rsa.h>

using json = nlohmann::json;

std::vector<unsigned char> rsaDecrypt(const std::vector<unsigned char>& encrypted, const std::string& privateKeyPath) {
    FILE* fp = fopen(privateKeyPath.c_str(), "r");
    if (!fp) throw std::runtime_error("Cannot open private key file");

    RSA* rsa = PEM_read_RSAPrivateKey(fp, nullptr, nullptr, nullptr);
    fclose(fp);
    if (!rsa) throw std::runtime_error("Failed to read RSA key");

    std::vector<unsigned char> decrypted(RSA_size(rsa));
    int len = RSA_private_decrypt(encrypted.size(), encrypted.data(), decrypted.data(), rsa, RSA_PKCS1_OAEP_PADDING);
    RSA_free(rsa);

    if (len == -1) throw std::runtime_error("RSA decryption failed");
    decrypted.resize(len);
    return decrypted;
}

std::vector<unsigned char> aesGcmDecrypt(
    const std::vector<unsigned char>& ciphertext,
    const std::vector<unsigned char>& key,
    const std::vector<unsigned char>& iv,
    const std::vector<unsigned char>& tag
) {
    EVP_CIPHER_CTX* ctx = EVP_CIPHER_CTX_new();
    std::vector<unsigned char> plaintext(ciphertext.size());
    int len = 0, out_len = 0;

    if (!EVP_DecryptInit_ex(ctx, EVP_aes_256_gcm(), nullptr, nullptr, nullptr))
        throw std::runtime_error("AES init failed");

    EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_SET_IVLEN, iv.size(), nullptr);
    EVP_DecryptInit_ex(ctx, nullptr, nullptr, key.data(), iv.data());
    EVP_DecryptUpdate(ctx, plaintext.data(), &len, ciphertext.data(), ciphertext.size());
    out_len = len;
    EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_SET_TAG, tag.size(), (void*)tag.data());

    if (EVP_DecryptFinal_ex(ctx, plaintext.data() + len, &len) <= 0)
        throw std::runtime_error("GCM decryption failed (bad tag?)");

    out_len += len;
    plaintext.resize(out_len);
    EVP_CIPHER_CTX_free(ctx);
    return plaintext;
}

json decryptAndParse(const std::string& jsonData, const std::string& privateKeyPath) {
    json j = json::parse(jsonData);

    auto d = base64Decode(j["d"]);
    auto k = base64Decode(j["k"]);
    auto n = base64Decode(j["n"]);
    auto t = base64Decode(j["t"]);

    auto aesKey = rsaDecrypt(k, privateKeyPath);
    auto decrypted = aesGcmDecrypt(d, aesKey, n, t);

    return json::parse(std::string(decrypted.begin(), decrypted.end()));
}
