class Tournament
{
    // Constructor
    constructor(participants = [])
    {
        this.participants = [];
        participants.forEach((player) => {
            this.participants.push(player);
        })

        this.matches = []
        this.rounds = 0;
        this.currentRount = 0;
        this.hasStarted = false;
    }

    // Utility Methods
    //////////////////

    StartEvent()
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
            this.matches[i].push([]);
            for (let j = 0; j <= i; j++)
            {
                this.matches[i].push(false);
            }
        }

        this.rounds = Math.max(Math.ceil(Math.log2(participants.length)), 3);
        this.currentRount = 1;
        this.hasStarted = true;
    }

    // User-Facing Methods
    //////////////////////

    // Add a new participant
    AddParticipant(participant)
    {
        // Fail if the event has started
        if (this.hasStarted)
        {
            return false;
        }

        this.participants.push(participant);
        return true;
    }

    DropParticipant(participant)
    {
        // Find index of dropping participant in participants array
        found = this.participants.indexOf(participant);

        // Fail if given participant is not in participants array
        if (found === -1)
        {
            return false;
        }

        // Remove participant
        this.participants.splice(found, 1);
        return true;
    }
}