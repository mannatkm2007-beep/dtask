const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Get Blynk token from .env file
const BLYNK_TOKEN = process.env.BLYNK_TOKEN;

// Create Express application
const app = express();

// Enable CORS
app.use(cors());

// Allow JSON data
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Backend is running");
});

// Receive a room name from the frontend
app.post("/toggle", async (req, res) => {

    const room = req.body.room;

    console.log("Room received:", room);

    let pin;

    // Select Blynk Virtual Pin
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
        return res.status(400).json({
            message: "Invalid room"
        });
    }

    try {

        // Send command to Blynk
        const url =
            `https://blynk.cloud/external/api/update` +
            `?token=${BLYNK_TOKEN}` +
            `&${pin}=1`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Blynk request failed");
        }

        // Send response back to frontend
        res.json({
            message: "Command sent to Blynk",
            room: room,
            pin: pin
        });

    }
    catch (error) {

        console.log("Blynk error:", error);

        res.status(500).json({
            message: "Could not connect to Blynk"
        });
    }
});

// Start the server
app.listen(3000, () => {

    console.log(
        "Backend running on http://localhost:3000"
    );

});