#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <MFRC522.h>
#include <SPI.h>

// Wi-Fi credentials
#define WIFI_SSID "Sadha's wifi"
#define WIFI_PASSWORD "sadhananthan@"

// Firebase credentials
#define API_KEY "AIzaSyCtNACwwY2Dz-W1IbDUnLm1vtkpyeoMSa8"
#define DATABASE_URL "https://evcard-cf10d-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define USER_EMAIL "saravana03backup@gmail.com"  // Replace with your email
#define USER_PASSWORD "Khushika@03"              // Replace with your password

// Firebase and RFID setup
FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;

#define RST_PIN D3 // RST pin for RC522
#define SS_PIN D4  // SDA (SS) pin for RC522

MFRC522 rfid(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(115200);
  SPI.begin();        // Init SPI bus
  rfid.PCD_Init();    // Init MFRC522
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  // Firebase config
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  // Set user credentials
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  // Initialize Firebase
  Firebase.reconnectNetwork(true);
  Firebase.begin(&config, &auth);

  // Sign in using email and password
  if (!Firebase.signIn(&config, &auth, USER_EMAIL, USER_PASSWORD)) {
    Serial.println("Firebase sign-in failed. Check your credentials or try again.");
    Serial.print("Error: ");
    Serial.println(firebaseData.errorReason()); // Print the error reason from firebaseData
  } else {
    Serial.println("Firebase sign-in successful.");
  }
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) {
    delay(50);
    return;
  }

  String cardUID = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    cardUID += String(rfid.uid.uidByte[i], HEX);
  }
  cardUID.toUpperCase();
  Serial.print("Detected UID: ");
  Serial.println(cardUID);

  // Save UID to Firebase
  if (Firebase.setString(firebaseData, "/cards/" + cardUID, cardUID)) {
    Serial.println("UID successfully written to Firebase");
  } else {
    Serial.print("Failed to write to Firebase: ");
    Serial.println(firebaseData.errorReason());
  }

  delay(1000);
  rfid.PICC_HaltA();  // Stop reading
}
