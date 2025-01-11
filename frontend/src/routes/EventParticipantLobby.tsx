import { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router";

import { CONTEXT_serverBaseUrl } from "../main";

import CreateConnection from "../functions/server_liaison";
import { SubscribedData } from "../types";

function EventParticipantLobby(): JSX.Element
{
    const serverUrl = useContext(CONTEXT_serverBaseUrl);
    const eventCode = useLocation().state.code;
    const player = useLocation().state.player;
    const navigate = useNavigate();

    // Invoke server_liaison to connect on loadrs
    useEffect(() => CreateConnection(serverUrl, eventCode, (data: SubscribedData) => {
        if (data.status == "running")
        {
            return navigate("/event/pairing", {state: {
                code: eventCode, 
                player: player, 
                match: data.matches?.filter((match) => {
                    match.p1 == player || match.p2 == player
            })}});
        }
    }), []);

    return(
        <div className="wrapper eventParticipantLobby">
            <h1>You're In!</h1>
            <p>Please remain on this page until the event begins.</p>
            <p>The event administrator will announce the names of all registered participants before the event begins. Please contact them immediately if your name is not read aloud.</p>
        </div>
    );
}

export default EventParticipantLobby;