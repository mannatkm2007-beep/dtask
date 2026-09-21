#define BLYNK_TEMPLATE_ID "TMPL3G2ygTxkt"
#define BLYNK_TEMPLATE_NAME "Linda Smart Home"
#define BLYNK_AUTH_TOKEN "EE7Jnqs68oX5GEykPUs8XoyEuMWw4asZ"

#include <WiFiNINA.h>
#include <BlynkSimpleWiFiNINA.h>


// Your phone hotspot details

char ssid[] = "HARSIMRAN";

char pass[] = "HARSIMRAN@2007";


// LED pins

const int livingRoomLED = 5;

const int bathroomLED = 3;

const int closetLED = 4;


// This function toggles the LED
// for the room received

void toggleRoom(String room)
{

    if (room == "living room")
    {
        digitalWrite(
            livingRoomLED,
            !digitalRead(livingRoomLED)
        );
    }

    else if (room == "bathroom")
    {
        digitalWrite(
            bathroomLED,
            !digitalRead(bathroomLED)
        );
    }

    else if (room == "closet")
    {
        digitalWrite(
            closetLED,
            !digitalRead(closetLED)
        );
    }
}


// Living Room switch: V0

BLYNK_WRITE(V0)
{
    toggleRoom("living room");
}


// Bathroom switch: V1

BLYNK_WRITE(V1)
{
    toggleRoom("bathroom");
}


// Closet switch: V2

BLYNK_WRITE(V2)
{
    toggleRoom("closet");
}


void setup()
{

    Serial.begin(9600);


    pinMode(
        livingRoomLED,
        OUTPUT
    );

    pinMode(
        bathroomLED,
        OUTPUT
    );

    pinMode(
        closetLED,
        OUTPUT
    );


    digitalWrite(
        livingRoomLED,
        LOW
    );

    digitalWrite(
        bathroomLED,
        LOW
    );

    digitalWrite(
        closetLED,
        LOW
    );


    Blynk.begin(
        BLYNK_AUTH_TOKEN,
        ssid,
        pass
    );
}


void loop()
{
    Blynk.run();
}
