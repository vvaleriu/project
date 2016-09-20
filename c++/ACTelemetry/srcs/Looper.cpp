//
// Created by vincent on 07/07/16.
//

#include "../headers/ACTelemetry.hpp"
#include "Looper.hpp"

Looper::Looper(char **av) {
	std::cout << "initialization" << std::endl;
	_acConnector = new ACConnector(av[1],
   					(av[2] != 0 ? (unsigned short) strtoul(av[2], NULL, 0) : (unsigned short)std::stoul("0")));
}

Looper::~Looper() {
	delete _acConnector;
	std::cout << "exiting" << std::endl;
}

int Looper::init() {
	std::cout << "[looper init]" << std::endl;
	_acConnector->prepareConnection();
	_acConnector->handshake();
	return 1;
}
