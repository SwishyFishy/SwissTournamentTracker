// Get express
const express = require("express");
const app = express();

// Get required modules
const {ipv4, port} = require("./private.js");
const cors = require("cors");
app.use(cors());

const Tournament = require("./event/tournament.js");

// Create tournament
const tournament = new Tournament();

///////////////////
// Define responses
///////////////////

// Test
app.get("/join/:name", (req, res) => {
    const name = req.params.name;
    tournament.AddParticipant(name);
    console.log(tournament);
    res.send("Joined!");
})

// Default
app.use("*", (req, res) => {
    res.status(404);
    res.send('Page Not Found');
})

///////////////////

// Listen on port
app.listen(port, ipv4, () => {
    console.log(`Server started on port ${port}`);
    console.log(`${ipv4}:${port}`);
});