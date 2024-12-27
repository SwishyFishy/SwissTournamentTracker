import { useState, useEffect, useContext } from "react";

import { CONTEXT_serverBaseUrl } from "../main";

function HostSetup(): JSX.Element
{
    const [players, setPlayers] = useState<Array<{id: string, name: string}>>([{id: '1', name: 'jonah'}]);
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
        <div className="eventAdminHome">
            <h1>Event Lobby</h1>
            <h2>Players</h2>
            <ol>
                {players.map((player) => (
                    <li key={player.id}>{player.name} <input type="button" name="kick" id="kick" value="X" /></li>
                ))}
            </ol>
            <form>
                <input type="submit" name="submit" id="submit" value="Start Event" />
            </form>
        </div>
    );
}

export default HostSetup;