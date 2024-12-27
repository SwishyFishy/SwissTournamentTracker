import { useState, useEffect, useContext } from "react";

import { CONTEXT_serverBaseUrl } from "../main";

function HostSetup(): JSX.Element
{
    const [players, setPlayers] = useState<Array<{id: string, name: string}>>([]);
    const serverUrl: string = useContext(CONTEXT_serverBaseUrl);

    // Kick a player using the X button
    const handleKickPlayer = (e: any) => {
        const kickId: string = e.currentTarget.parentElement.getAttribute('data-id');
        setPlayers((curPlayers) => {
            return curPlayers.filter((p) => p.id != kickId)
        });
    }

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
        <div className="wrapper eventAdminHome">
            <h1>Event Lobby</h1>
            <h2>Players</h2>
            <ul>
                {players.map((player) => (
                    <li key={player.id} data-id={player.id}>{player.name} <input type="button" name="kick" id="kick" value="X" onClick={handleKickPlayer} /></li>
                ))}
            </ul>
            <form>
                <input type="submit" name="submit" id="submit" value="Start Event" />
            </form>
        </div>
    );
}

export default HostSetup;