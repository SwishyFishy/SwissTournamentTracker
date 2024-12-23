class Tournament
{
    // Constructor
    constructor(participants = [])
    {
        this.participants = [];
        participants.forEach((player) => {
            this.participants.push({name: player, score: 0, omw: 0, gw: 0, ogw: 0, opponents: []});
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
        // Only initialie the lower triangle, since the upper triangle is redundant. Use the diagonal for byes
        for (let i = 0; i < this.participants.length; i++)
        {
            this.matches.push([]);
            for (let j = 0; j <= i; j++)
            {
                this.matches[i].push(false);
            }
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
        if (this.currentRound < 1 || this.participants.indexOf(participant) > -1)
        {
            return false;
        }

        this.participants.push({name: participant, score: 0, omw: 0, gw: 0, ogw: 0, opponents: []});
        return true;
    }

    // Drop a participant
    DropParticipant(participant)
    {
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
        

        return true;
    }
    static __MatchBuilder()
    {

    }
}