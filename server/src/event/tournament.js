class Tournament
{
    // Constructor
    constructor(participants = [])
    {
        this.participants = [];
        participants.forEach((player) => {
            this.participants.push({id: 0, name: player, points: 0, wins: 0, losses: 0, draws: 0, omw: 0, gw: 0, ogw: 0});
        });

        this.matches = [];
        this.currentRound = [];
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

    // User-Facing Methods
    //////////////////////

    // Add a new participant
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
    RemoveParticipant(participant)
    {
        // Fail if the event has started
        if (this.currentRound > 0)
        {
            return false;
        }

        // Find index of dropping participant in participants array
        const found = this.participants.indexOf(this.participants.find((player) => player.name = participant));

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
    DropParticipant(participant)
    {

    }

    // Determine participant placement on the leaderboard
    // Associated private function __ComparePlacement is the CompareFn implementation for Array.Protoptype.toSorted
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

    // Advance to the next round, recording the current round
    // Associated private function __MatchBuilder for recursively building the next round's matches
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
        this.RankParticipants();
        this.__MatchBuilder(structuredClone(this.participants));

        console.log(this);

        return true;
    }
    __MatchBuilder(unmatchedParticipants)
    {

    }
}

test = new Tournament(['john', 'jonah', 'jim', 'jacob', 'jules', 'george', 'jeff']);
test.StartTournament();