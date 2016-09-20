//
// Created by vincent on 07/07/16.
//

#ifndef ACTELEMETRY_LOOPER_HPP
# define ACTELEMETRY_LOOPER_HPP


#include "ACConnector.h"

class Looper {
public:
	Looper(char **av);
	~Looper(void);
	int init();

private:
	ACConnector		*_acConnector;
};


#endif //ACTELEMETRY_LOOPER_HPP
