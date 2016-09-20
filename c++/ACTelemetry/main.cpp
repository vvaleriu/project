#include <iostream>
#include "srcs/ACConnector.h"
#include "srcs/Looper.hpp"

using namespace std;

int main(int ac, char **av) {
	if (ac == 1) {
		cout << "You must provide an Assetto Corsa server address." << endl;
		return 0;
	}
	Looper looper = Looper(av);
	looper.init();
    return 0;
}