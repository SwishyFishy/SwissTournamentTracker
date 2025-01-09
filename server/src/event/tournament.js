class Tournament
{
    // Nested Participant class to store player information
    __Participant = class
    {
        // Constructor
        // name: string
        constructor(name)
        {
            // Data members
            this.id = 0;
            this.name = name;
            this.opponents = [];
            this.mWins = 0;
            this.mLosses = 0;
            this.mDraws = 0;
            this.matches = 0;
            this.gWins = 0;
            this.gLosses = 0;
            this.games = 0;
        }

        // User-Facing Methods
        //////////////////////

        CalcPoints()
        {
            return (3 * this.mWins) + this.mDraws;
        }

        CalcMW()
        {
            return this.matches == 0 ? 0 : (this.mWins / this.matches) * 100;
        }

        CalcOMW()
        {
            let oppWins = 0;
            let oppMatches = 0;
            this.opponents.forEach((opponent) => {
                oppWins += opponent.mWins;
                oppMatches += opponent.matches;
            })

            return oppMatches == 0 ? 0 : (oppWins / oppMatches) * 100
        }

        CalcGW()
        {
            return this.games == 0 ? 0 : (this.gWins / this.games) * 100;
        }

        CalcOGW()
        {
            let oppWins = 0;
            let oppGames = 0;
            this.opponents.forEach((opponent) => {
                oppWins += opponent.gWins;
                oppGames += opponent.games;
            })

            return oppGames == 0 ? 0 : (oppWins / oppGames) * 100
        }

        HasBye()
        {
            this.mWins += 1;
            this.matches += 1;
        }

        SubmitMatchResults(wins, losses, opponent)
        {
            this.gWins += wins;
            this.gLosses += losses;
            this.games += wins + losses;

            if (wins > losses)
            {
                this.mWins++;
            }
            else if (wins < losses)
            {
                this.mLosses++;
            }
            else
            {
                this.mDraws++;
            }
            this.matches++;

            this.opponents.push(opponent);
        }
    }   

    // Constructor
    // participants: array<string>
    constructor(participants = [])
    {
        this.participants = [];

        this.hasStarted = false;
        this.running = false;

        this.matches = [];
        this.currentMatches = [];
        this.rounds = 0;
        this.currentRound = 0;

        // Add passed players
        participants.forEach((player) => {
            this.AddParticipant(player);
        });

        // Getters
        this.getStatus = () => {
            return this.hasStarted ? (this.running ? "running" : "over") : "pending"; 
        }

        this.getPlayers = () => {
            const players = [];
            this.participants.forEach((player) => {
                players.push({id: String(player.id), name: player.name});
            })
            return players;
        }

        this.getLeaderboard = () => {
            this.__RankParticipants();

            const leaderboard = [];
            this.participants.forEach((player) => {
                leaderboard.push({
                    id: player.id,
                    name: player.name,
                    points: player.CalcPoints(),
                    wins: player.mWins,
                    losses: player.mLosses,
                    draws: player.mDraws,
                    omw: player.CalcOMW(),
                    gw: player.CalcGW(),
                    ogw: player.CalcOGW()
                })
            })

            return leaderboard;
        }

        this.getRounds = () => {
            return {currentRound: this.currentRound, maxRound: this.rounds}
        }

        this.getCurrentMatches = () => {
            if (this.currentMatches === false)
            {
                return null;
            }

            const matches = [];
            this.currentMatches.forEach((match) => {
                matches.push({p1: match.p1name, p2: match.p2name, p1wins: match.p1wins, p2wins: match.p2wins})
            })
            return matches;
        }
    }

    // Utility Methods
    //////////////////

    // Verify that the tournament has yet to run
    __VerifyNotStarted()
    {
        if (this.hasStarted)
        {
            throw new Error("Tournament not started");
        }
    }

    // Verify that the tournament is running
    __VerifyRunning()
    {
        if (!this.running)
        {
            throw new Error("Tournament not running");
        }
    }
    
    // Determine participant placement on the leaderboard
    // Associated private function __ComparePlacement is the CompareFn implementation for Array.Protoptype.sort
    __RankParticipants()
    {
        this.participants.sort(this.__ComparePlacement);
    }
    __ComparePlacement(par1, par2)
    {
        // Compare points
        const pointOrder = -1 * (par1.CalcPoints() - par2.CalcPoints());
        if (pointOrder != 0)
        {
            return pointOrder;
        }

        // Compare OMW
        const omwOrder = -1 * (par1.CalcOMW() - par2.CalcOMW());
        if (omwOrder != 0)
        {
            return omwOrder;
        }

        // Compare GW
        const gwOrder = -1 * (par1.CalcGW() - par2.CalcGW());
        if (gwOrder != 0)
        {
            return gwOrder;
        }

        // Compare OGW
        const ogwOrder = -1 * (par1.CalcOGW() - par2.CalcOGW());
        if (ogwOrder != 0)
        {
            return ogwOrder;
        }
    }

    // User-Facing Methods
    //////////////////////

    // Add a new participant
    // participant: string
    AddParticipant(participant)
    {
        // Fail if the event has started or if the participant is already registered or if the participant has not provided a name / named themselves 'bye'
        this.__VerifyNotStarted();
        if (participant == "" || participant.toLowerCase() == "bye" || this.participants.findIndex((player) => player.name.toLowerCase() == participant.toLowerCase()) > -1)
        {
            return false;
        }

        this.participants.push(new this.__Participant(participant));
        return true;
    }

    // Remove a participant from the event.
    // participant: string
    RemoveParticipant(participant)
    {
        // Fail if the event has started
        this.__VerifyNotStarted();

        // Find index of dropping participant in participants array
        const found = this.participants.findIndex((player) => player.name == participant);

        // Fail if given participant is not in participants array
        if (found === -1)
        {
            return false;
        }

        // Remove participant
        this.participants.splice(found, 1);
        return true;
    }

    // Drop a participant mid-event
    // participant: string
    DropParticipant(participant)
    {
        // Fail if the event has not started
        this.__VerifyRunning();

        // Find id of dropping player
        let found = this.participants.find((player) => player.name == participant);

        // Fail if given participant is not in participants array
        if (found === undefined)
        {
            return false;
        }
        else
        {
            found = found.id;
        }

        // Mark this player's row in matches as "DROP"
        this.matches[found] = "DROP";
        
        // Mark this player as having had a match with every other player
        for (let i = found + 1; i < this.matches.length; i++)
        {
            this.matches[i][found] = true;
        }

        return true;
    }

    // Update the values of player wins in one element of currentMatches
    // player1: string
    // player2: string
    // p1wins: int
    // p2wins: int
    ReportMatchResults(player1, player2, p1wins, p2wins)
    {
        this.__VerifyRunning();

        // Fail if the given pair of players do not have an ongoing match
        const match = this.currentMatches.find((match) => (match.p1name == player1 && match.p2name == player2));
        if (match === undefined)
        {
            return false;
        }
        // Fail if the given pair of players are the same player (i.e. the bye)
        if (match.p1id == match.p2id)
        {
            return false;
        }

        match.p1wins = p1wins;
        match.p2wins = p2wins;

        return true;
    }

    // Initialize round 1 and disable AddParticipant
    StartTournament()
    {
        // Fail if the tournament has started
        this.__VerifyNotStarted();

        // Declare that the tournament is now running
        this.hasStarted = true;
        this.running = true;

        // Shuffle the participants array so that join-order is sure to not matter
        for (let i = this.participants.length - 1; i >= 0; i--) 
        {
            const index = Math.floor(Math.random() * (i + 1));
            [this.participants[i], this.participants[index]] = [this.participants[index], this.participants[i]];
        }

        // Initialize a 2d array of booleans to false to track which players have played a match
        // Only initialize the lower triangle, since the upper triangle is redundant. Use the diagonal for byes
        // Hijack the loop to assign unique integer participant ids.
        //      The array of participants is expected to mutate, so each participant is assigned a unique integer id corresponding to their initial position in the array, used to index players in the matches array
        for (let i = 0; i < this.participants.length; i++)
        {
            this.matches.push([]);
            for (let j = 0; j <= i; j++)
            {
                this.matches[i].push(false);
            }
            
            this.participants[i].id = i;
        }

        this.rounds = Math.max(Math.ceil(Math.log2(this.participants.length)), 3);
        return this.NextRound(true);
    }

    // Advance to the next round, recording the current round
    // Associated private function __MatchBuilder recursively builds the next round's matches
    // startevent: boolean
    NextRound(startevent = false)
    {
        this.__VerifyRunning();

        // Record current round match results
        if (!startevent)
        {
            this.currentMatches.forEach((match) => {

                // Set this.matches = true for this pairing
                const low = Math.min(match.p1id, match.p2id);
                const high = Math.max(match.p1id, match.p2id);
                if (this.matches[high] != "DROP")
                {
                    this.matches[high][low] = true;
                }

                // Handle bye
                if (match.p1id == match.p2id)
                {
                    const player = this.participants.find((player) => player.id == match.p1id);
                    player.HasBye();
                }
                // Handle match
                else
                {
                    const player1 = this.participants.find((player) => player.id == match.p1id);
                    const player2 = this.participants.find((player) => player.id == match.p2id);
                        
                    player1.SubmitMatchResults(match.p1wins, match.p2wins, player2);
                    player2.SubmitMatchResults(match.p2wins, match.p1wins, player1);
                }  
            });
        }

        // Check if the tournament is over
        this.currentRound++;
        if (this.currentRound > this.rounds)
        {
            return this.EndTournament();
        }

        // Set up next round
        // Pass __MatchBuilder an array of players in leaderboard order, with any that dropped the event filtered out.
        this.__RankParticipants();
        this.currentMatches = this.__MatchBuilder(structuredClone(this.participants).filter((player) => this.matches[player.id] !== "DROP"))
        if (this.currentMatches === false)
        {
            return ["Fail", this.participants];
        }

        return ["Round", this.getCurrentMatches()];
    }
    // unmatchedParticipants: array<Object>
    // proposedPairs: array<Object>
    __MatchBuilder(unmatchedParticipants, proposedPairs = [])
    {
        // Recursively find a pairing, remove those players, call self, until all pairings made successfully
        // For the highest-ranked unmatched player, check all possible pairings in descending leaderboared order
        // Use the bye only as a last resort
        const player = unmatchedParticipants[0];
        let opponentIndex;
        for (let i = unmatchedParticipants.length - 1; i >= 0; i--)
        {
            // Invert countdown except on 0 such that matches are checked in descending leaderboard order, then the bye
            if (i != 0)
            {
                opponentIndex = unmatchedParticipants.length - i;
            }
            else
            {
                opponentIndex = i;
            }

            // Normalize player, opponent since only 1 triangle of this.matches is used
            const opponent = unmatchedParticipants[opponentIndex];
            let p1, p2;
            if (player.id < opponent.id)
            {
                p1 = opponent;
                p2 = player;
            }
            else
            {
                p1 = player;
                p2 = opponent;
            }

            // Check pairing validity
            if (this.matches[p1.id][p2.id] == false)
            {
                if (unmatchedParticipants.length <= 2 ||                                            // Base case - there are no more unmatchedParticipants
                    this.__MatchBuilder(unmatchedParticipants.toSpliced(opponentIndex, 1).toSpliced(0, 1), proposedPairs) !== false)     // Recursive case
                {
                    // Handle the bye
                    // Requiring that unmatchedParticipants be of odd length forces a maximum of 1 bye
                    if (player.id == opponent.id && unmatchedParticipants.length % 2 == 1)
                    {
                        proposedPairs.push({p1id: player.id, p1name: player.name,  p2id: player.id, p1wins: 2, p2wins: undefined});
                        return proposedPairs;
                    }
                    // Handle a match
                    else if (player.id != opponent.id)
                    {   
                        proposedPairs.push({p1id: player.id, p1name: player.name, p2id: opponent.id, p2name: opponent.name, p1wins: 0, p2wins: 0});
                        return proposedPairs;
                    }
                }
            }
        }

        // Return false if there is no possible pairing for the initial conditions
        return false;
    }

    // Disable round advancement & matchmaking and return a final leaderboard
    EndTournament()
    {
        this.__VerifyRunning();
        this.running = false;

        this.__RankParticipants();
        return ["Leaderboard", this.getLeaderboard()];
    }

    // Testing Methods
    //////////////////

    Dump()
    {
        console.log(`Round: ${this.currentRound} / ${this.rounds}`);
        this.participants.forEach((player) => {
            console.log(player, player.CalcPoints(), player.CalcOMW(), player.CalcGW(), player.CalcOGW())
        })
        console.log(`Match History:`, this.matches);
        console.log(`Current Matches:`, this.currentMatches);
    }
}

module.exports = Tournament;