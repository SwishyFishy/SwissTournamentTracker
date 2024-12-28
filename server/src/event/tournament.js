class Participant
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

        // Data members calculated on-call
        /*this.points = () => {return (3 * this.mWins) + this.mDraws};
        this.mw = () => {this.matches == 0 ? 0 : (this.mWins / this.matches) * 100};
        this.omw = () => {
            let oppWins = 0;
            let oppMatches = 0;
            this.opponents.forEach((opponent) => {
                oppWins += opponent.mWins;
                oppMatches += opponent.matches;
            })

            return oppMatches == 0 ? 0 : (oppWins / oppMatches) * 100;
        };
        this.gw = () => {return this.games == 0 ? 0 : (this.gWins / this.games) * 100};
        this.ogw = () => {
            let oppWins = 0;
            let oppGames = 0;
            this.opponents.forEach((opponent) => {
                oppWins += opponent.gWins;
                oppGames += opponent.games;
            })
    
            return oppGames == 0 ? 0 : (oppWins / oppGames) * 100
        };*/
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
            this.mWins += 1;
        }
        else if (wins < losses)
        {
            this.mLosses += 1;
        }
        else
        {
            this.mDraws += 1;
        }
        this.matches += 1;

        this.opponents.push(opponent);
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

    // Initialize round 1 and disable AddParticipant
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

test = new Tournament(['john', 'jonah', 'jim', 'jacob', 'jules', 'george', 'jeff', 'joseph', 'james']);
test.StartTournament();
for(let i = 1; i < test.currentMatches.length; i++)
{
    test.ReportMatchResults(test.currentMatches[i].p1name, test.currentMatches[i].p2name, Math.floor(Math.random() * 3), Math.floor(Math.random() * 3))
}
test.NextRound();
for(let i = 1; i < test.currentMatches.length; i++)
{
    test.ReportMatchResults(test.currentMatches[i].p1name, test.currentMatches[i].p2name, Math.floor(Math.random() * 3), Math.floor(Math.random() * 3))
}
test.Dump();