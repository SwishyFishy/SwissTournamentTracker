class Participant
{
    // Constructor
    // name: string
    constructor(name)
    {
        this.id = 0;
        this.name = name;
        this.wins = 0;
        this.losses = 0;
        this.draws = 0;
        this.matches = 0;
        this.games = 0;
        this.omr = {w: 0, p: 0};
        this.ogr = {w: 0, p: 0};
    }

    // User-Facing Methods
    //////////////////////

    CalcPoints()
    {
        return (3 * this.wins) + this.draws;
    }

    CalcMW()
    {
        return (this.wins / this.matches) * 100
    }

    CalcOMW()
    {
        return (this.omr.w / this.omr.p) * 100;
    }

    CalcGW()
    {
        return (this.wins / this.games) * 100;
    }

    CalcOGW()
    {
        return (this.ogr.w / this.ogr.p) * 100;
    }
}

class Tournament
{
    // Constructor
    // participants: array<string>
    constructor(participants = [])
    {
        this.participants = [];
        participants.forEach((player) => {
            this.participants.push(new Participant(player));
        });

        this.matches = [];
        this.currentMatches = [];
        this.rounds = 0;
        this.currentRound = 0;
    }

    // Utility Methods
    //////////////////

    StartTournament()
    {
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
        this.NextRound(true);
    }
    
    // Determine participant placement on the leaderboard
    // Associated private function __ComparePlacement is the CompareFn implementation for Array.Protoptype.sort
    RankParticipants()
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
        // Fail if the event has started or if the participant is already registered
        if (this.currentRound > 0 || this.participants.indexOf(participant) > -1)
        {
            return false;
        }

        this.participants.push(new Participant(participant));
        return true;
    }

    // Remove a participant from the event.
    // participant: string
    RemoveParticipant(participant)
    {
        // Fail if the event has started
        if (this.currentRound > 0)
        {
            return false;
        }

        // Find index of dropping participant in participants array
        const found = this.participants.indexOf(this.participants.find((player) => player.name == participant));

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
        if (this.currentRound < 1)
        {
            return false;
        }

        // Find index of dropping participant in participants array
        const found = this.participants.findIndex((player) => player.name == participant);

        // Fail if given participant is not in participants array
        if (found === -1)
        {
            return false;
        }

        // Mark this player's row in matches as "DROP"
        // Mark this player as having had a match with every other player
        for (let i = 0; i < this.participants.length; i++)
        {
            for (let j = 0; j <= i; j++)
            {
                if (i == found)
                {
                    this.matches[i] = "DROP";
                }
                else if (j == found)
                {
                    this.matches[i][j] = true;
                }
            }
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
        // Fail if the given pair of players do not have an ongoing match
        const match = this.currentMatches.find((match) => match.p1name == player1 && match.p2name == player2);
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

    // Advance to the next round, recording the current round
    // Associated private function __MatchBuilder recursively builds the next round's matches
    // startevent: boolean
    NextRound(startevent = false)
    {
        // Record current round match results
        if (!startevent)
        {
            this.currentMatches.forEach((match) => {

                // Set this.matches = true for this pairing
                const low = Math.min(match.p1id, match.p2id);
                const high = Math.max(match.p1id, match.p2id);
                this.matches[high][low] = true;

                // Handle bye
                if (match.p1id == match.p2id)
                {
                    const player = this.participants.find((player) => player.id == match.p1id);

                    // Update player stats (wins, matches)
                    player.wins = player.wins + 1;
                    player.matches = player.matches + 1;

                    // Update previous opponents' stats (omr)
                    for (let i = 0; i <= player.id; i++)
                    {
                        if (this.matches[player.id][i])
                        {
                            const previousOpponent = this.participants.find((opponent) => opponent.id == i);
                            previousOpponent.omr.w = previousOpponent.omr.w + 1;
                            previousOpponent.omr.p = previousOpponent.omr.p + 1;
                        }
                    }
                    for (let i = player.id + 1; i < this.participants.length; i++)
                    {
                        if (this.matches[i][player.id])
                        {
                            const previousOpponent = this.participants.find((opponent) => opponent.id == i);
                            previousOpponent.omr.w = previousOpponent.omr.w + 1;
                            previousOpponent.omr.p = previousOpponent.omr.p + 1;
                        }
                    }
                }
                // Handle match
                else
                {
                    const player1 = this.participants.find((player) => player.id == match.p1id);
                    const player2 = this.participants.find((player) => player.id == match.p2id);

                    // Handle a draw
                    if (match.p1wins == match.p2wins)
                    {
                        // Update player stats (draws, matches, games)
                        player1.draws = player1.draws + 1;
                        player1.matches = player1.matches + 1;
                        player1.games = player1.games + match.p1wins + match.p2wins;
                        
                        player2.draws = player2.draws + 1;
                        player2.matches = player2.matches + 1;
                        player2.games = player2.games + match.p1wins + match.p2wins;
                        
                        // Update previous opponents' stats (omr, ogr) - also does these stats for the current round opponent
                        // Player 1
                        for (let i = 0; i <= player1.id; i++)
                        {
                            if (this.matches[player1.id][i])
                            {
                                const previousOpponent = this.participants.find((opponent) => opponent.id == i);
                                previousOpponent.omr.p = previousOpponent.omr.p + 1;
                                previousOpponent.ogr.w = previousOpponent.ogr.w + match.p1wins;
                                previousOpponent.ogr.p = previousOpponent.ogr.p + match.p1wins + match.p2wins;
                            }
                        }
                        for (let i = player1.id + 1; i < this.participants.length; i++)
                        {
                            if (this.matches[i][player1.id])
                            {
                                const previousOpponent = this.participants.find((opponent) => opponent.id == i);
                                previousOpponent.omr.p = previousOpponent.omr.p + 1;
                                previousOpponent.ogr.w = previousOpponent.ogr.w + match.p1wins;
                                previousOpponent.ogr.p = previousOpponent.ogr.p + match.p1wins + match.p2wins;
                            }
                        }
                        // Player 2
                        for (let i = 0; i <= player2.id; i++)
                        {
                            if (this.matches[player2.id][i])
                            {
                                const previousOpponent = this.participants.find((opponent) => opponent.id == i);
                                previousOpponent.omr.p = previousOpponent.omr.p + 1;
                                previousOpponent.ogr.w = previousOpponent.ogr.w + match.p2wins;
                                previousOpponent.ogr.p = previousOpponent.ogr.p + match.p1wins + match.p2wins;
                            }
                        }
                        for (let i = player2.id + 1; i < this.participants.length; i++)
                        {
                            if (this.matches[i][player2.id])
                            {
                                const previousOpponent = this.participants.find((opponent) => opponent.id == i);
                                previousOpponent.omr.p = previousOpponent.omr.p + 1;
                                previousOpponent.ogr.w = previousOpponent.ogr.w + match.p2wins;
                                previousOpponent.ogr.p = previousOpponent.ogr.p + match.p1wins + match.p2wins;
                            }
                        }
                    }
                    // Handle a victory
                    else
                    {
                        let winner, loser;
                        if (match.p1wins > match.p2wins)
                        {
                            winner = player1;
                            loser = player2;
                        }
                        else
                        {
                            winner = player2;
                            loser = player1;
                        }

                        // Update player stats (wins, losses, draws, points, gw)
                        winner.wins = winner.wins + 1;
                        winner.matches = winner.matches + 1;
                        winner.games = winner.games + match.p1wins + match.p2wins;
                        
                        loser.losses = loser.losses + 1;
                        loser.matches = loser.matches + 1;
                        loser.games = loser.games + match.p1wins + match.p2wins;
                        
                        // Update previous opponents' stats (omw, ogw) - also does these stats for the current round opponent
                        // Winner
                        for (let i = 0; i <= winner.id; i++)
                        {
                            if (this.matches[winner.id][i])
                            {
                                const previousOpponent = this.participants.find((opponent) => opponent.id == i);
                                previousOpponent.omr.w = previousOpponent.omr.w + 1
                                previousOpponent.omr.p = previousOpponent.omr.p + 1;
                                previousOpponent.ogr.w = previousOpponent.ogr.w + Math.max(match.p1wins, match.p2wins);
                                previousOpponent.ogr.p = previousOpponent.ogr.p + match.p1wins + match.p2wins;
                            }
                        }
                        for (let i = winner.id + 1; i < this.participants.length; i++)
                        {
                            if (this.matches[i][winner.id])
                            {
                                const previousOpponent = this.participants.find((opponent) => opponent.id == i);
                                previousOpponent.omr.w = previousOpponent.omr.w + 1
                                previousOpponent.omr.p = previousOpponent.omr.p + 1;
                                previousOpponent.ogr.w = previousOpponent.ogr.w + Math.max(match.p1wins, match.p2wins);
                                previousOpponent.ogr.p = previousOpponent.ogr.p + match.p1wins + match.p2wins;
                            }
                        }
                        // Loser
                        for (let i = 0; i <= loser.id; i++)
                        {
                            if (this.matches[loser.id][i])
                            {
                                const previousOpponent = this.participants.find((opponent) => opponent.id == i);
                                previousOpponent.omr.p = previousOpponent.omr.p + 1;
                                previousOpponent.ogr.w = previousOpponent.ogr.w + Math.min(match.p1wins, match.p2wins);
                                previousOpponent.ogr.p = previousOpponent.ogr.p + match.p1wins + match.p2wins;
                            }
                        }
                        for (let i = loser.id + 1; i < this.participants.length; i++)
                        {
                            if (this.matches[i][loser.id])
                            {
                                const previousOpponent = this.participants.find((opponent) => opponent.id == i);
                                previousOpponent.omr.p = previousOpponent.omr.p + 1;
                                previousOpponent.ogr.w = previousOpponent.ogr.w + Math.min(match.p1wins, match.p2wins);
                                previousOpponent.ogr.p = previousOpponent.ogr.p + match.p1wins + match.p2wins;
                            }
                        }
                    }
                }  
            });
        }

        // Check if the tournament is over
        this.currentRound++;
        if (this.currentRound > this.rounds)
        {
            return false
        }

        // Set up next round
        // Pass __MatchBuilder an array of players in leaderboard order, with any that dropped the event filtered out.
        this.RankParticipants();
        this.currentMatches = this.__MatchBuilder(structuredClone(this.participants).filter((player) => this.matches[player.id] !== "DROP"))
        if (this.currentMatches === false)
        {
            throw new Error("No Valid Pairings");
        }

        return true;
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
                    if (player.id == opponent.id)
                    {
                        proposedPairs.push({p1id: player.id, p2id: player.id, p1name: player.name, p1wins: 2});
                    }
                    else
                    {   
                        proposedPairs.push({p1id: player.id, p1name: player.name, p2id: opponent.id, p2name: opponent.name, p1wins: 0, p2wins: 0});
                    }

                    return proposedPairs;
                }
            }
        }

        // Return false if there is no possible pairing for the initial conditions
        return false;
    }
}

test = new Tournament(['john', 'jonah', 'jim', 'jacob', 'jules', 'george', 'jeff', 'joseph', 'james']);
test.StartTournament();
console.log(test);