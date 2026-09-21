// ===================================================================
// script.js - runs in the browser (frontend)
// Job: when a carer clicks a room checkbox, send that room's name
// to the Node.js backend, which then talks to Blynk.
// ===================================================================


// Get the three room controls from the HTML page
// (document.getElementById finds each checkbox using the id set in index.html)

const livingRoom =
    document.getElementById("livingRoom");

const bathroom =
    document.getElementById("bathroom");

const closet =
    document.getElementById("closet");


// Send the selected room to the backend
// "async" lets us use "await" to wait for the server's reply
// without freezing the page.
// The room text must exactly match what server.js expects:
// "living room", "bathroom" or "closet".

async function sendRoom(room) {

    // Print the room name in the browser console (useful for debugging)
    console.log("Sending room:", room);

    // try/catch handles the case where the backend is not reachable
    try {

        // Send the room name to our Node.js backend
        // (POST request to the /toggle route in server.js)

        const response = await fetch(
            "http://localhost:3000/toggle",
            {
                // POST is used because we are sending data to the server
                method: "POST",

                // Tell the backend that we are sending JSON data

                headers: {
                    "Content-Type": "application/json"
                },

                // Convert the room name into JSON

                body: JSON.stringify({
                    room: room
                })
            }
        );


        // Get the response sent back by the backend
        // (converts the reply from JSON text into a JavaScript object)

        const data =
            await response.json();


        // Show the backend response
        // in the browser console

        console.log(
            "Backend response:",
            data
        );

    }

    catch (error) {

        // Display an error if the backend
        // cannot be reached
        // (for example when server.js is not running)

        console.log(
            "Error connecting to backend:",
            error
        );

    }
}


// Event listeners
// A "change" event fires each time a checkbox is ticked or unticked.
// Each listener calls sendRoom() with the name of its own room.

// Run the function whenever the
// Living Room checkbox changes

livingRoom.addEventListener(
    "change",
    function () {

        sendRoom("living room");

    }
);


// Run the function whenever the
// Bathroom checkbox changes

bathroom.addEventListener(
    "change",
    function () {

        sendRoom("bathroom");

    }
);


// Run the function whenever the
// Closet checkbox changes

closet.addEventListener(
    "change",
    function () {

        sendRoom("closet");

    }
);
