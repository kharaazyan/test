#pragma once
#include <string>

class CLI {
public:
    void run();

private:
    std::string lastPrevCID;
    void loadCID(const std::string& cid);
};
