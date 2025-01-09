import { useEffect } from "react";
import { useNavigate } from "react-router";

import CreateConnection from "../functions/server_liaison";
import { SubscribedData } from "../types";

function EventParticipantLobby(): JSX.Element
{
    const navigate = useNavigate();

    // Invoke server_liaison to connect on load
    useEffect(() => CreateConnection((data: SubscribedData) => {
        if (data.status == "running")
        {
            navigate("/event/pairing");
        }
    }), []);

    return(
        <div className="wrapper eventParticipantHome">
            <p>EventParticipantLobby page</p>
        </div>
    );
}

export default EventParticipantLobby;