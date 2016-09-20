//
// Created by vincent on 07/07/16.
//

#ifndef ACTELEMETRY_HELPERS_HPP
# define ACTELEMETRY_HELPERS_HPP

# include "../headers/ACStructures.h"
# include "../headers/ACTelemetry.hpp"

class Helpers {
public:
	Helpers(void);
	~Helpers(void);
	static int acHsr_toString(ac_hsr & hsr);
	static int sockaddrIn_toString(struct sockaddr_in &sin);

private:

};


#endif //ACTELEMETRY_HELPERS_HPP
