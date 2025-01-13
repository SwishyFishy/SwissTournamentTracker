import { useState, useEffect, useContext, createContext } from "react";
import { Outlet, useParams, useSearchParams } from "react-router";

import { SubscribedData } from "../types";
import { CONTEXT_serverBaseUrl } from "../main";
import CreateConnection from "../functions/server_liaison";

const init: SubscribedData = {rounds: undefined, matches: undefined, players: undefined, leaderboard: undefined, status: undefined, message: undefined};
export const CONTEXT_eventDetails: React.Context<SubscribedData> = createContext(init);

function EventSubscriber(): JSX.Element
{
    const [details, setDetails] = useState<SubscribedData>(init);
    const serverUrl = useContext(CONTEXT_serverBaseUrl);
    const {eventCode} = useParams() as {eventCode: string};
    const player: string = useSearchParams()[0].get("player")!;

    // Invoke server_liaison to connect on load
    useEffect(() => CreateConnection(serverUrl, eventCode, player,
        (data: SubscribedData) => { setDetails({...data});}, 
        (data: SubscribedData) => { return data !== undefined && data.players !== undefined && data.players.find((p: any) => p.name == player && p.dropped) !== undefined}
    ), []);

    return (
        <CONTEXT_eventDetails.Provider value={details}>
            <Outlet />
        </CONTEXT_eventDetails.Provider>
    );
}

export default EventSubscriber;