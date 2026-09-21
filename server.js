// ===================================================================
// server.js - Node.js backend (Express)
// Job: receive a room name from the web page, convert it to a Blynk
// virtual pin (V0/V1/V2) and send it to the Blynk cloud over HTTPS.
// The backend keeps the Blynk token secret, so it is never exposed
// in the browser code.
// ===================================================================

// Express: framework used to create the web server and routes
const express = require("express");

// CORS: allows the web page (a different origin) to call this server
const cors = require("cors");

// dotenv: loads values from the .env file into process.env
require("dotenv").config();

// Get Blynk token from .env file
const BLYNK_TOKEN = process.env.BLYNK_TOKEN;

// Create Express application
const app = express();

// Enable CORS
app.use(cors());

// Allow JSON data
// (lets us read req.body.room from the JSON sent by script.js)
app.use(express.json());

// Test route
// Open http://localhost:3000 in a browser to check the server is running
app.get("/", (req, res) => {
    res.send("Backend is running");
});

// Receive a room name from the frontend
// This route is called by script.js each time a checkbox changes
app.post("/toggle", async (req, res) => {

    // Room name sent in the JSON body
    const room = req.body.room;

    // Print the room in the terminal for debugging
    console.log("Room received:", room);

    // Will hold the Blynk virtual pin for the chosen room
    let pin;

    // Select Blynk Virtual Pin
    // Convert the room name into the virtual pin used in Blynk
    if (room === "living room") {
        pin = "V0";
    }
    else if (room === "bathroom") {
        pin = "V1";
    }
    else if (room === "closet") {
        pin = "V2";
    }
    else {
        // Unknown room name: reply with a 400 (bad request) error
        return res.status(400).json({
            message: "Invalid room"
        });
    }

    // try/catch handles network problems or errors from Blynk
    try {

        // Send command to Blynk
        // Builds the Blynk HTTPS API link that writes the value 1
        // to the chosen virtual pin of our device.
        // Writing to the pin makes Blynk run the matching
        // BLYNK_WRITE handler on the Arduino.
        const url =
            `https://blynk.cloud/external/api/update` +
            `?token=${BLYNK_TOKEN}` +
            `&${pin}=1`;

        // Call the Blynk API and wait for its reply
        const response = await fetch(url);

        // If Blynk answers with an error status, jump to the catch block
        if (!response.ok) {
            throw new Error("Blynk request failed");
        }

        // Send response back to frontend
        // (tells script.js that the command was sent successfully)
        res.json({
            message: "Command sent to Blynk",
            room: room,
            pin: pin
        });

    }
    catch (error) {

        // Show the error in the terminal
        console.log("Blynk error:", error);

        // Tell the frontend that something went wrong (500 = server error)
        res.status(500).json({
            message: "Could not connect to Blynk"
        });
    }
});

// Start the server
// It listens on port 3000, matching the address used in script.js
app.listen(3000, () => {

    console.log(
        "Backend running on http://localhost:3000"
    );

});
