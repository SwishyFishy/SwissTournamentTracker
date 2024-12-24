class Tournament
{
    // Constructor
    // participants: array<string>
    constructor(participants = [])
    {
        this.participants = [];
        participants.forEach((player) => {
            this.participants.push({id: 0, name: player, points: 0, wins: 0, losses: 0, draws: 0, omw: 0, gw: 0, ogw: 0});
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
        const pointOrder = -1 * (par1.points - par2.points);
        if (pointOrder != 0)
        {
            return pointOrder;
        }

        // Compare OMW
        const omwOrder = -1 * (par1.omw - par2.omw);
        if (omwOrder != 0)
        {
            return omwOrder;
        }

        // Compare GW
        const gwOrder = -1 * (par1.gw - par2.gw);
        if (gwOrder != 0)
        {
            return gwOrder;
        }

        // Compare OGW
        const ogwOrder = -1 * (par1.ogw - par2.ogw);
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

        this.participants.push({id: 0, name: participant, points: 0, wins: 0, losses: 0, draws: 0, omw: 0, gw: 0, ogw: 0});
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
                    proposedPairs.push({p1id: player.id, p1name: player.name, p2id: opponent.id, p2name: opponent.name, p1wins: 0, p2wins: 0});
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