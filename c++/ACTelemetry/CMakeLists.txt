cmake_minimum_required(VERSION 3.5)
project(ACTelemetry)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")

set(SOURCE_FILES main.cpp srcs/ACConnector.cpp srcs/ACConnector.h headers/ACStructures.h headers/ACTelemetry.hpp srcs/Looper.cpp srcs/Looper.hpp srcs/Helpers.cpp srcs/Helpers.hpp)
add_executable(ACTelemetry ${SOURCE_FILES})

#[[
find_package(Boost)
IF (Boost_FOUND)
	include_directories(${Boost_INCLUDE_DIR})
endif()

set (Boost_USE_STATIC_LIBS OFF) # enable dynamic linking
find_package (Boost COMPONENTS REQUIRED chrono filesystem)]]
