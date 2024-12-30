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

// Add a player to the tournament
app.get("/join/:name", (req, res) => {
    const name = req.params.name;

    // Attempt to add player
    try
    {
        if (tournament.AddParticipant(name))
        {
            res.status(200);
            res.send("Added");
        }
        else
        {
            res.status(400);
            res.send("This tournament already contains a player with that name")
        }
    }
    catch (Error)
    {
        res.status(409);
        res.send("This tournament can no longer be joined");
    }
})

// Remove a player from the tournament
app.get("/leave/:name", (req, res) => {
    const name = req.params.name;

    // Attempt to remove player
    try
    {
        if (tournament.RemoveParticipant(name))
        {
            res.status(200);
            res.send("Removed");
        }
        else
        {
            res.status(400);
            res.send("This tournament does not contain a player with that name")
        }
    }
    catch (Error)
    {
        res.status(409);
        res.send("This tournament has already started");
    }
})

// Drop a player from the tournament
app.get("/drop/:name", (req, res) => {
    const name = req.params.name;

    // Attempt to drop player
    try
    {
        if (tournament.DropParticipant(name))
        {
            res.status(200);
            res.send("Dropped");
        }
        else
        {
            res.status(400);
            res.send("This tournament does not contain a player with that name")
        }
    }
    catch (Error)
    {
        res.status(409);
        res.send("This tournament has not started");
    }
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