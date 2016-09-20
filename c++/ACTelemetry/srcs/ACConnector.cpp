//
// Created by vincent on 19/06/16.
//

#include "ACConnector.h"
#include "Helpers.hpp"

/*
 * ============================
 * 		PUBLIC METHODS
 * ============================
 * */

/*
 * @params ac_server_ip: server ip address string
 * @params [port]: server port
 * */
ACConnector::ACConnector(char const *ac_server_ip, unsigned short port)
		: _hip(ac_server_ip), _hport(port == 0 ? (unsigned short)AC_SERVER_PORT : port) {
	std::cout <<  "IP du serveur :" << _hip << ", port : " << _hport << std::endl;
}

/*
 * Closes socket on leaving
 * */
ACConnector::~ACConnector() {
	std::cout <<  "Je suis en train d'etre detruite" << std::endl;
	closesocket(_socket);
}

/*
 * Prepare connection by getting a socket and populating sockaddr_in
 * */
void ACConnector::prepareConnection() {
	std::cout << "[On rentre dans prepareConnection]" << std::endl;
	// On cree le socket
	_socket = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);
	if (_socket == INVALID_SOCKET) {
		perror("socket()");
		exit(errno);
	}

	// On remplit l'adresse de connexion
	std::cout << "adr: " << _hip << std::endl;
	memset(&_hsockaddr_in, 0, sizeof(_hsockaddr_in));
	if (inet_aton(_hip, &(_hsockaddr_in.sin_addr)) == 0) {
		perror("inet_aton");
		exit(errno);
	}
	_hsockaddr_in.sin_port = htons(_hport);
	_hsockaddr_in.sin_family = AF_INET;
	std::cout << "[On sort de prepareConnection]" << std::endl;
}

/**
 * - On envoit la solicitation
 * - On va essayer de lire la reponse si elle toutefois elle est recue
 * */
int ACConnector::handshake()
{
	struct timeval tv;
	int selRet;
	int rd;
	int total_rd;
	ac_handshaker hs = {1, 1, 0};
	ac_hsr hsr;

	std::cout << "[On rentre dans handshake]" << std::endl;
	Helpers::sockaddrIn_toString(_hsockaddr_in);
	tv.tv_sec = 5;
	tv.tv_usec = 0;
	rd = 0;
	total_rd = 0;
	if ((rd = sendto(_socket, &hs, sizeof(hs), 0, (SOCKADDR *)&_hsockaddr_in, _hsi_size)) <= 0) {
		perror("handshake()- sendto() ");
		exit(errno);
	}
	std::cout << "[handshake sent: " << rd << " - waiting for response]" << std::endl;
	rd = 0;
	FD_ZERO(&rfd);
	FD_SET(_socket, &rfd);
	selRet = select(_socket + 1, &rfd, NULL, NULL, &tv);
	if (selRet == -1) {
		perror("handshake() - select()");
		exit(errno);
	}
	else if (selRet) {
		memset(&hsr, 0, sizeof(hsr));
		while ((rd = recvfrom(_socket, &hsr, sizeof(hsr), 0, (SOCKADDR *)&_hsockaddr_in, &_hsi_size) != 0)) {
			total_rd += rd;
			if (total_rd == sizeof(hsr))
				break;
		}
		Helpers::acHsr_toString(hsr);
	}
	return 1;
}

int ACConnector::sendData()
{
	if (sendto(_socket, _buf, strlen(_buf), 0, (SOCKADDR *)&_hsockaddr_in, _hsi_size) < 0) {
		perror("sendto()");
		exit(errno);
		return -1;
	}
	return 1;
}

int ACConnector::receiveData() {
	ssize_t rc = 0;

	if ((rc += recvfrom(_socket, _buf, sizeof _buf - 1, 0, (SOCKADDR *)&_hsockaddr_in, &_hsi_size)) < 0) {
		perror("recvfrom()");
		exit(errno);
	}
	return 1;
}

/*
 * Un subscribe client to server update
 * */
int ACConnector::dismiss() {
	struct ac_handshaker ach = {1, 1, 3};
	return 1;
}


/*
 * ============================
 * 		PRIVATE METHODS
 * ============================
 * */

/*
 * ============================
 * 		HELPERS
 * ============================
 * */

ACConnector&	ACConnector::operator=(ACConnector const & rhs) {
	(void)rhs;
	return (*this);
};

void ACConnector::toString() {
	std::cout <<  "toString" << std::endl;
}
