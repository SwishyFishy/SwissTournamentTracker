import { useState, useEffect, useContext, createContext } from "react";
import { useLocation, Outlet } from "react-router";

import { SubscribedData } from "../types";
import { CONTEXT_serverBaseUrl } from "../main";
import CreateConnection from "../functions/server_liaison";

const init: SubscribedData = {rounds: undefined, matches: undefined, players: undefined, leaderboard: undefined, status: undefined};
export const CONTEXT_eventDetails: React.Context<SubscribedData> = createContext(init);

function EventSubscriber()
{
    const [details, setDetails] = useState<SubscribedData>(init);
    const serverUrl = useContext(CONTEXT_serverBaseUrl);
    const eventCode = useLocation().state.code;

    // Invoke server_liaison to connect on load
    useEffect(() => CreateConnection(serverUrl, eventCode, (data: SubscribedData) => {
        setDetails({...data});
    }), []);

    return (
        <CONTEXT_eventDetails.Provider value={details}>
            <Outlet />
        </CONTEXT_eventDetails.Provider>
    );
}

export default EventSubscriber;