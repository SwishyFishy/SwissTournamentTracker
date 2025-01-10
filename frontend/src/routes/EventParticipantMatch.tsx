import { useLocation } from "react-router";

function EventParticipantMatch(): JSX.Element
{
    return(
        <p>{useLocation().state.player}</p>
    );
}

export default EventParticipantMatch;