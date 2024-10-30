#include <SPI.h>
#include <MFRC522.h>
#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <ESP8266WebServer.h>

// Wi-Fi credentials
#define WIFI_SSID "Sadha's wifi"
#define WIFI_PASSWORD "sadhananthan@"

// Firebase configuration
FirebaseConfig config;
FirebaseAuth auth;
#define FIREBASE_HOST "https://evcard-cf10d-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define FIREBASE_AUTH "L3gDdcWvMhPsFENpSoeaobestmG4SOeDOl0C8oL9"

// RFID Pins
constexpr uint8_t RST_PIN = D3;
constexpr uint8_t SS_PIN = D4;

MFRC522 rfid(SS_PIN, RST_PIN); // RFID instance
FirebaseData firebaseData;      // Firebase data instance
ESP8266WebServer server(80);    // HTTP server on port 80

String tag;
String phoneNumber = ""; // Placeholder for phone number

void setup() {
  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init(); // Initialize RFID

  // Connect to Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to Wi-Fi...");
  }
  Serial.println("Connected to Wi-Fi");

  // Display IP address
  Serial.print("ESP8266 IP address: ");
  Serial.println(WiFi.localIP());

  // Initialize Firebase
  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // Set up /addCard endpoint with CORS headers
  server.on("/addCard", HTTP_GET, []() {
    server.sendHeader("Access-Control-Allow-Origin", "*"); // Enable CORS
    if (readAndSaveRFID()) {
      server.send(200, "text/plain", "Card saved to Firebase successfully.");
    } else {
      server.send(500, "text/plain", "Failed to save card to Firebase.");
    }
  });

  // Set up /setPhoneNumber endpoint
  server.on("/setPhoneNumber", HTTP_GET, []() {
    server.sendHeader("Access-Control-Allow-Origin", "*"); // Enable CORS
    phoneNumber = server.arg("phone"); // Get the phone number from the query parameter
    server.send(200, "text/plain", "Phone number set.");
  });

  // Set up /verifyCard endpoint
  server.on("/verifyCard", HTTP_GET, []() {
    server.sendHeader("Access-Control-Allow-Origin", "*"); // Enable CORS
    if (verifyRFIDWithPhone()) {
      server.send(200, "text/plain", "Card and phone verified successfully.");
    } else {
      server.send(403, "text/plain", "Card or phone not found in database.");
    }
  });

  server.begin(); // Start the server
}

void loop() {
  server.handleClient(); // Handle incoming client requests
}

// Function to read RFID and save to Firebase
bool readAndSaveRFID() {
  if (!rfid.PICC_IsNewCardPresent()) return false;

  if (rfid.PICC_ReadCardSerial()) {
    tag = "";
    for (byte i = 0; i < rfid.uid.size; i++) {
      tag += String(rfid.uid.uidByte[i], HEX);
    }
    Serial.println("RFID Tag ID: " + tag);

    // Save phone number and RFID under "phoneNumber/rfid" path in Firebase
    String path = "/RFIDTags/" + phoneNumber + "/" + tag;
    bool success = Firebase.setString(firebaseData, path, tag);
    if (success) {
      Serial.println("Tag and phone number saved to Firebase successfully.");
    } else {
      Serial.print("Failed to save data to Firebase: ");
      Serial.println(firebaseData.errorReason());
    }

    // Clear tag and halt RFID
    tag = "";
    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
    return success;
  }
  return false;
}

// Function to verify RFID with phone number
bool verifyRFIDWithPhone() {
  if (!rfid.PICC_IsNewCardPresent()) return false;

  if (rfid.PICC_ReadCardSerial()) {
    tag = "";
    for (byte i = 0; i < rfid.uid.size; i++) {
      tag += String(rfid.uid.uidByte[i], HEX);
    }

    // Check if "phoneNumber/rfid" path exists in Firebase
    String path = "/RFIDTags/" + phoneNumber + "/" + tag;
    bool exists = Firebase.getString(firebaseData, path);
    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
    return exists && firebaseData.stringData() == tag;
  }
  return false;
}
