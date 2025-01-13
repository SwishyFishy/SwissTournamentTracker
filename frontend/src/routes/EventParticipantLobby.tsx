import { useEffect, useContext } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

import { CONTEXT_eventDetails } from "./EventSubscriber";

function EventParticipantLobby(): JSX.Element
{
    const eventDetails = useContext(CONTEXT_eventDetails);
    const {eventCode} = useParams() as {eventCode: string};
    const player: string = useSearchParams()[0].get("player")!;

    const navigate = useNavigate();

    // Check if the event has started and redirect whenever the event details change
    useEffect(() => {
        if (eventDetails.status == "running")
        {
            navigate(`/${eventCode}/pairing?player=${player}`);
        }
    }, [eventDetails])

    return(
        <div className="wrapper eventParticipantLobby">
            <h1>You're In!</h1>
            <p className="centered">Please remain on this page until the event begins.</p>
            <p className="centered">The event administrator will announce the names of all registered participants before the event begins. Please contact them immediately if your name is not read aloud.</p>
        </div>
    );
}

export default EventParticipantLobby;