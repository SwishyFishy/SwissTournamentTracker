import { useState, useContext, createContext } from "react";
import { Outlet, useParams, useSearchParams } from "react-router";

import { SubscribedData } from "../types";
import ServerConnection from "../functions/server_liaison";
import { CONTEXT_serverBaseUrl } from "../main";

const init: SubscribedData = {rounds: undefined, matches: undefined, players: undefined, leaderboard: undefined, status: undefined, message: undefined};
export const CONTEXT_eventDetails: React.Context<SubscribedData> = createContext(init);

function EventSubscriber(): JSX.Element
{
    const [details, setDetails] = useState<SubscribedData>(init);
    const serverUrl = useContext(CONTEXT_serverBaseUrl);
    const {eventCode} = useParams() as {eventCode: string};
    const player: string = useSearchParams()[0].get("player")!;
    const connection = useState<ServerConnection>(
        new ServerConnection(serverUrl, eventCode, (data: SubscribedData) => { 
            setDetails({...data});
            if (data.status == "over" || data.players!.find((p) => p.name == player && p.dropped))
            {
                connection.disconnect();
            }
        })
    )[0];

    return (
        <CONTEXT_eventDetails.Provider value={details}>
            <Outlet />
        </CONTEXT_eventDetails.Provider>
    );
}

export default EventSubscriber;