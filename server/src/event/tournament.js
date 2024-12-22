class Tournament
{
    // Constructor
    constructor(participants = [])
    {
        this.participants = participants;
        this.rounds = 0;
        this.currentRount = 0;
        this.hasStarted = false;
    }

    // Utility Methods
    //////////////////

    StartEvent()
    {
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