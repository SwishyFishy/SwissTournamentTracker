import { useState, useEffect, useContext } from "react";

import { CONTEXT_serverBaseUrl } from "../main";

function EventAdminHome(): JSX.Element
{
    const [players, setPlayers] = useState<Array<{id: string, name: string}>>([]);
    const serverUrl: string = useContext(CONTEXT_serverBaseUrl);

    useEffect(() => {
        // Create a handler to recieve pushed server events and append players to the player list
        const playerJoinEventSource: EventSource = new EventSource(serverUrl);
        playerJoinEventSource.onmessage = (e) => {
            const player = JSON.parse(e.data);
            setPlayers([...players, player]);
        };

        // Close the connection on component unmount
        return () => playerJoinEventSource.close();
    }, []);

    return(
        <p>EventAdminHome page</p>
    );
}

export default EventAdminHome;