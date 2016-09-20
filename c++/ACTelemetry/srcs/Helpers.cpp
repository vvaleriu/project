//
// Created by vincent on 07/07/16.
//

#include "Helpers.hpp"

Helpers::Helpers() {

}

Helpers::~Helpers() {

}

int Helpers::acHsr_toString(ac_hsr & hsr) {
	std::cout << "carName: " << hsr.carName << std::endl;
	std::cout << "driverName: " << hsr.driverName << std::endl;
	std::cout << "identifier: " << hsr.identifier << std::endl;
	std::cout << "version: " << hsr.version << std::endl;
	std::cout << "trackName: " << hsr.trackName << std::endl;
	std::cout << "trackConfig: " << hsr.trackConfig << std::endl;
	return 1;
}

int Helpers::sockaddrIn_toString(struct sockaddr_in &sin) {
	std::cout << "family: " << (short)sin.sin_family << std::endl;
	std::cout << "port: " << ntohs(sin.sin_port) << std::endl;
	std::cout << "in_addr: " << inet_ntoa(sin.sin_addr) << std::endl;
	return 1;
}