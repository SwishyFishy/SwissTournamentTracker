// Get express
const express = require("express");
const app = express();

// Get required modules
const {ipv4, port} = require("./private.js");
const cors = require("cors");
app.use(cors());

const Tournament = require("./event/tournament.js");
const ShortUniqueId = require("short-unique-id");
const codegen = new ShortUniqueId({length: 8, dictionary: 'alphanum_lower'});

// Create tournament
const events = [];

///////////////////
// Define endpoints
///////////////////

// Create a new tournament
app.get("/create", (req, res) => {
    const code = codegen.rnd();
    events.push({code: code, tournament: new Tournament});
    res.status(200);
    res.json({
        code: code
    })
})

// Delete a tournament
app.get("/delete/:event", (req, res) => {
    const tournament = extractTournament(req.params.event, () => { res.status(400); res.send("Tournament does not exist"); }, "INDEX")

    // Delete the tournament
    events.splice(tournament, 1);
    res.status(200);
    res.send("Deleted");
})

// Add a player to the tournament
app.get("/join/:event", (req, res) => {
    const tournament = extractTournament(req.params.event, () => { res.status(400); res.send("Tournament does not exist"); })
    const name = req.query.name;

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
app.get("/leave/:event", (req, res) => {
    const tournament = extractTournament(req.params.event, () => { res.status(400); res.send("Tournament does not exist"); })
    const name = req.query.name;

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
app.get("/drop/:event", (req, res) => {
    const tournament = extractTournament(req.params.event, () => { res.status(400); res.send("Tournament does not exist"); })
    const name = req.query.name;

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

// Get the list of players in the tournament
app.get("/list/:event", (req, res) => {
    const tournament = events.find((t) => t.code == req.params.event).tournament;
    if (tournament === undefined)
    {
        res.status(400);
        res.send("Tournament does not exist");
    }

    // Send player list
    res.status(200);
    res.json({
        players: tournament.getPlayers()
    })
})

// Start the event
app.get("/start/:event", (req, res) => {
    const tournament = extractTournament(req.params.event, () => { res.status(400); res.send("Tournament does not exist"); })

    // Start event
    try
    {
        tournament.StartTournament();
        res.status(200);
        res.send("Started");
    }
    catch(Error)
    {
        res.status(409);
        res.send("This tournament cannot be started");
    }
})

// Advance to the next round
app.get("/advance/:event", (req, res) => {
    const tournament = extractTournament(req.params.event, () => { res.status(400); res.send("Tournament does not exist"); })

    // Advance to the next round
    try
    {
        const result = tournament.NextRound();
        res.status(200);
        res.json({
            status: result[0] == "Round" ? 'Continue' : 'Over'
        })
    }
    catch (Error)
    {
        res.status(409);
        res.send("Cannot advance to next round");
    }
})

// Get the record of the current matches
app.get("/round/:event", (req, res) => {
    const tournament = extractTournament(req.params.event, () => { res.status(400); res.send("Tournament does not exist"); })

    // Send matches record
    res.status(200);
    res.json({
        round: tournament.getRounds(),
        matches: tournament.getCurrentMatches() 
    })
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

////////////////////

// Utility Functions
////////////////////

function extractTournament(code, failResp, mode = "EVENT")
{
    let tournament; 
    if (mode == "EVENT")
    {
        tournament = events.find((t) => t.code == code);
        if (tournament === undefined)
        {
            failResp();
        }
    }
    else if (mode == "INDEX")
    {
        tournament = events.findIndex((t) => t.code == code);
        if (tournament === -1)
        {
            failResp();
        }
    }

    return tournament.tournament;
}