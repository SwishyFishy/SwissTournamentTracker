import { useEffect, useContext } from "react";
import { useLocation } from "react-router";
import { redirect } from "react-router";

import { CONTEXT_serverBaseUrl } from "../main";

import CreateConnection from "../functions/server_liaison";
import { SubscribedData } from "../types";

function EventParticipantLobby(): JSX.Element
{
    const serverUrl = useContext(CONTEXT_serverBaseUrl);
    const eventCode = useLocation().state.code;

    // Invoke server_liaison to connect on load
    useEffect(() => CreateConnection(serverUrl, eventCode, (data: SubscribedData) => {
        if (data.status == "running")
        {
            return redirect("/event/pairing");
        }
    }), []);

    return(
        <div className="wrapper eventParticipantHome">
            <p>EventParticipantLobby page</p>
        </div>
    );
}

export default EventParticipantLobby;