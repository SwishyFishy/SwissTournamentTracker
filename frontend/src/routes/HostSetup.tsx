import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";

import { CONTEXT_serverBaseUrl } from "../main";

import '../styles/HostSetup.css';

function HostSetup(): JSX.Element
{
    const [players, setPlayers] = useState<Array<{id: string, name: string}>>([
        {id: '1', name: 'jonah'},
        {id: '2', name: 'curt'},
        {id: '3', name: 'gregory'},
        {id: '4', name: 'spock'},
        {id: '5', name: 'aslan'},
        {id: '6', name: 'janice'},
        {id: '7', name: 'hela'},
        {id: '8', name: 'ken'},
        {id: '9', name: 'chad'}
    ]);
    const [eventCode, setEventCode] = useState<string>("");
    const serverUrl: string = useContext(CONTEXT_serverBaseUrl);
    const navigate = useNavigate();

    // Kick a player using the X button
    const handleKickPlayer = (e: any) => {
        const kickId: string = e.currentTarget.parentElement.getAttribute('data-id');
        setPlayers((curPlayers) => {
            return curPlayers.filter((p) => p.id != kickId)
        });
    }

    // Connect to server on load to receive push events when a player joins
    useEffect(() => {
        // Create and link to a tournament on the server
        async function createTournament()
        {
            const response: Response = await fetch(serverUrl + "create");
            if (!response.ok)
            {
                console.log(response);
                navigate("/");
            }
            
            const code = await response.text;
            setEventCode(code);
        }

        createTournament();

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
        <div className="wrapper hostSetup">
            <h1>Event Lobby</h1>
            <h2>Players</h2>
            <ul>
                {players.map((player) => (
                    <li key={player.id} data-id={player.id}><span>{player.name}</span> <input type="button" name="kick" id="kick" value="X" onClick={handleKickPlayer} /></li>
                ))}
            </ul>
            <form>
                <input type="button" name="submit" id="submit" value="Start Event" />
            </form>
        </div>
    );
}

export default HostSetup;