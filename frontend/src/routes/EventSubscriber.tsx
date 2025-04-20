import { useState, useEffect, useContext, createContext } from "react";
import { Outlet, useParams, useNavigate } from "react-router";

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
    const [connection, setConnection] = useState<ServerConnection | undefined>(undefined);
    const navigate = useNavigate();

    // Load a socket connection
    // Can't be initialized in the useState declaration directly due to its interaction with the 'new' operator
    useEffect(() => {
        setConnection(new ServerConnection(serverUrl, eventCode, (data: SubscribedData) => {
            if (data.message == "cancel_tournament")
            {
                try {ServerConnection.disconnect(connection!); } catch(error) {}
                navigate("/", {state: {error: true, emsg: "The host cancelled the tournament"}});
            }
            setDetails({...data});
        }));
    }, []);

    return (
        <CONTEXT_eventDetails.Provider value={details}>
            <Outlet />
        </CONTEXT_eventDetails.Provider>
    );
}

export default EventSubscriber;