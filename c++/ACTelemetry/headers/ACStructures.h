/*
 * Created by vincent on 19/06/16.
 *
 * Contains AC structure and macro definitions
*/

#ifndef ACTELEMETRY_ACSTRUTURES_H
#define ACTELEMETRY_ACSTRUTURES_H

// operationId
# define HANDSHAKE			0
# define SUBSCRIBE_UPDATE	1
# define SUBSCRIBE_SPOT		2
# define DISMISS			3

/*
 * Sert a se faire connaitre aupres du server ainsi qu'a s'abonner aux mises
 * a jour.
 * */
struct ac_handshaker {
	int identifier;
	int version;
	int operationId;
};

/*
 * Reponse recue a la suite du handshake
 * */
typedef struct ac_handshackerResponse {
	char 	carName[50];
	char 	driverName[50];
	int 	identifier;
	int 	version;
	char 	trackName[50];
	char 	trackConfig[50];
} ac_hsr;



/*
 * Reponse recue losque l'on s'abonne a
 * */
struct RTCarInfo {
	char 	identifier;
	int		size;
	float 	speed_Kmh;
	float 	speed_Mph;
	float 	speed_Ms;
	bool    isAbsEnabled;
	bool	isAbsInAction;
	bool	isTcInAction;
	bool	isTcEnabled;
	bool	isInPit;
	bool	isEngineLimiterOn;
	float	accG_vertical;
	float	accG_horizontal;
	float	accG_frontal;
	int 	lapTime;
	int 	lastLap;
	int 	bestLap;
	int		lapCount;
	float 	gas;
	float 	brake;
	float 	clutch;
	float 	engineRPM;
	float 	steer;
	int  	gear;
	float	cgHeight;

	float    wheelAngularSpeed[4];
	float    slipAngle[4];
	float    slipAngle_ContactPatch[4];
	float    slipRatio[4];
	float    tyreSlip[4];
	float    ndSlip[4];
	float    load[4];
	float    Dy[4];
	float    Mz[4];
	float    tyreDirtyLevel[4];
	float    camberRAD[4];
	float    tyreRadius[4];
	float    tyreLoadedRadius[4];
	float    suspensionHeight[4];
	float    carPositionNomalized;
	float    carSlope;
	float    carCoordinates[3];
};

#endif //ACTELEMETRY_ACSTRUTURES_H
