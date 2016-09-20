//
// Created by vincent on 19/06/16.
//

#ifndef ACTELEMETRY_ACCONNECTOR_H
# define ACTELEMETRY_ACCONNECTOR_H

// WINDOWS
/*#ifdef WIN32
# include <winsock2.h>
#endif

// LINUX
#ifdef linux
# include <sys/types.h>
# include <sys/socket.h>
# include <netinet/in.h>
# include <arpa/inet.h>
# include <unistd.h>
# include <netdb.h>
# define INVALID_SOCKET		-1
# define SOCKET_ERROR		-1
# define closesocket(s)		close(s)

typedef int SOCKET;
typedef struct sockaddr_in	SOCKADDR_IN;
typedef struct sockaddr		SOCKADDR;
typedef struct in_addr		IN_ADDR;
#endif*/

# include "../headers/ACTelemetry.hpp"
# include "../headers/ACStructures.h"

# define INVALID_SOCKET	-1
# define SOCKET_ERROR	-1
# define closesocket(s)	close(s)
# define AC_SERVER_PORT	9996

typedef int SOCKET;
typedef struct sockaddr_in SOCKADDR_IN;
typedef struct sockaddr SOCKADDR;
typedef struct in_addr IN_ADDR;

/*
 * ASSETTO CORSA STRUCTURE
 * */

class ACConnector {
public:

	//CONSTRUCTORS
	ACConnector(char const *ac_server_ip, unsigned short port);
    virtual ~ACConnector();
    ACConnector& operator=(ACConnector const& rhs);

	//ATTRIBUTES
	fd_set rfd;
	fd_set wfd;

	//METHODS
	void	prepareConnection();
	int 	handshake();
	int 	dismiss();

	int 	sendData();
	int 	receiveData();
	void 	toString();

private:
//    ATTRIBUTES
    SOCKET					_socket; // socket = file descriptor
	SOCKADDR_IN				_hsockaddr_in = {0}; // host sockaddr_in
	char 					_buf[1024];
	const char 				*_hip; // host ip
	unsigned short const	_hport; // host port
	struct hostent			*_hostinfo;
	socklen_t	 			_hsi_size = sizeof _hsockaddr_in;

//     METHODS
};


#endif //ACTELEMETRY_ACCONNECTOR_H
