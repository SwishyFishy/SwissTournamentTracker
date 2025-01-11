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
const SSE = require('express-sse');

const events = [];

///////////////////
// Define endpoints
///////////////////

// Create a new tournament
app.get("/create", (req, res) => {
    const code = codegen.rnd();
    events.push({code: code, tournament: new Tournament, clients: []});
    res.status(200);
    res.json({
        code: code
    })
})

// Delete a tournament
app.get("/delete/:event", (req, res) => {
    const tournamentIndex = extractTournament(req.params.event, () => { res.status(404); res.send("Tournament does not exist"); }, "INDEX")

    // Delete the tournament
    events.splice(tournamentIndex, 1);
    res.status(200);
    res.send("Deleted");
})

// Add a player to a tournament
app.get("/join/:event", (req, res) => {
    const tournamentObj = extractTournament(req.params.event, () => { res.status(404); res.send("Tournament does not exist"); }, "OBJECT");
    const tournament = tournamentObj.tournament;
    const name = req.query.name;

    // Attempt to add player
    try
    {
        if (tournament.AddParticipant(name))
        {
            updateSubscribers(tournamentObj);

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

// Remove a player from a tournament
app.get("/leave/:event", (req, res) => {
    const tournament = extractTournament(req.params.event, () => { res.status(404); res.send("Tournament does not exist"); })
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

// Drop a player from a tournament
app.get("/drop/:event", (req, res) => {
    const tournament = extractTournament(req.params.event, () => { res.status(404); res.send("Tournament does not exist"); })
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

// Get the list of players in a tournament
app.get("/list/:event", (req, res) => {
    const tournament = extractTournament(req.params.event, () => { res.status(404); res.send("Tournament does not exist"); })

    // Send player list
    res.status(200);
    res.json({
        players: tournament.getPlayers()
    })
})

// Start a tournament
app.get("/start/:event", (req, res) => {
    const tournamentObj = extractTournament(req.params.event, () => { res.status(404); res.send("Tournament does not exist"); }, "OBJECT")
    const tournament = tournamentObj.tournament;

    // Start event
    try
    {
        tournament.StartTournament();
        updateSubscribers(tournamentObj);

        res.status(200);
        res.send("Started");
    }
    catch(Error)
    {
        res.status(409);
        res.send("This tournament cannot be started");
    }
})

// Advance to the next round of a tournament
app.get("/advance/:event", (req, res) => {
    const tournamentObj = extractTournament(req.params.event, () => { res.status(404); res.send("Tournament does not exist"); }, "OBJECT")
    const tournament = tournamentObj.tournament;

    // Advance to the next round
    try
    {
        const result = tournament.NextRound();
        updateSubscribers();

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

// Get the record of the current matches of a tournament
app.get("/round/:event", (req, res) => {
    const tournament = extractTournament(req.params.event, () => { res.status(404); res.send("Tournament does not exist"); })

    // Send matches record
    res.status(200);
    res.json(compileTournamentData(tournament));
})

// Get the leaderboard of a tournament
app.get("/leaderboard/:event", (req, res) => {
    const tournament = extractTournament(req.params.event, () => { res.status(404); res.send("Tournament does not exist"); })

    res.status(200);
    res.json(compileTournamentData());
})

// Input a match score for a tournament match
app.get("/report/:event", (req, res) => {
    const tournamentObj = extractTournament(req.params.event, () => { res.status(404); res.send("Tournament does not exist"); }, "OBJECT")
    const tournament = tournamentObj.tournament;
    const p1 = req.query.p1;
    const p2 = req.query.p2;
    const p1wins = Number(req.query.p1wins);
    const p2wins = Number(req.query.p2wins);

    // Report the match
    try
    {
        if (tournament.ReportMatchResults(p1, p2, p1wins, p2wins))
        {
            updateSubscribers(tournamentObj);

            res.status(200);
            res.send("Reported");
        }
        else
        {
            res.status(400);
            res.send("Match does not exist");
        }
    }
    catch (Error)
    {
        res.status(409);
        res.send("Tournament cannot accept match reports");
    }
})

// Append a client to a list of open connections automatically updated when the tournament data changes
app.get("/subscribe/:event", (req, res) => {
    const tournamentObj = extractTournament(req.params.event, () => { res.status(404); res.send("Tournament does not exist"); }, "OBJECT")
    const sse = new SSE([compileTournamentData(tournamentObj.tournament)]);
    sse.init(req, res);
    tournamentObj.clients.push(sse);
})

// Debugging page
app.get("/debug", (req, res) => {
    res.status(200);
    res.json({
        events: JSON.parse(JSON.stringify(events, (key, value) => {
            if (key === 'opponents') 
            { 
                return '[opponents]'; 
            }
            else if (key === 'clients')
            {
                return '[clients]';
            }
            return value;
        }))
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
    console.log(`${ipv4}:${port}/debug`);
});

////////////////////

// Utility Functions
////////////////////

/**
 * Get the tournament code from the url, or call failResp if no such tournament exists 
 * 
 * @param   mode    'EVENT' => returns the tournament, 'INDEX' => returns the index of the tournament in events[], 'OBJECT' => returns the tournament object
*/ 
function extractTournament(code, failResp, mode = "EVENT")
{
    if (mode == "EVENT")
    {
        const tournament = events.find((t) => t.code == code);
        if (tournament === undefined)
        {
            failResp();
        }

        return tournament.tournament;
    }
    else if (mode == "INDEX")
    {
        const tournament = events.findIndex((t) => t.code == code);
        if (tournament === -1)
        {
            failResp();
        }

        return tournament;
    }
    else if (mode == "OBJECT")
    {
        const tournament = events.find((t) => t.code == code);
        if (tournament === undefined)
        {
            failResp();
        } 

        return tournament;
    }
}

// Compile all of the requested tournament data into a single json object
function compileTournamentData(tournament, r = true, p = true, m = true, l = true, s = true)
{
    const data = {};

    if (r)
    {
        data.rounds = tournament.getRounds();
    }

    if (p)
    {
        data.players = tournament.getPlayers();
    }
    
    if (m)
    {
        data.matches = tournament.getCurrentMatches();
    }

    if (l)
    {
        data.leaderboard = tournament.getLeaderboard();
    }

    if (s)
    {
        data.status = tournament.getStatus();
    }

    return(data);
}

// Forward the most up-to-date tournament data to each client
function updateSubscribers(tournamentObj, r = true, p = true, m = true, l = true, s = true)
{
    try
    {
        tournamentObj.clients.forEach((client) => {
            client.send(compileTournamentData(tournamentObj.tournament));
        })
    }
    catch (Error)
    {
        console.log(Error);
    }
}