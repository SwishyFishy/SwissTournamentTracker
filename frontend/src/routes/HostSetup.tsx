import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";

import { CONTEXT_serverBaseUrl } from "../main";

import '../styles/HostSetup.css';

function HostSetup(): JSX.Element
{
    const [players, setPlayers] = useState<Array<{id: string, name: string}>>([]);
    const [eventCode, setEventCode] = useState("");
    const serverUrl: string = useContext(CONTEXT_serverBaseUrl);
    const navigate = useNavigate();

    // Kick a player using the X button
    const handleKickPlayer = (e: any) => {
        const kickId: string = e.currentTarget.parentElement.getAttribute('data-id');
        setPlayers((curPlayers) => {
            return curPlayers.filter((p) => p.id != kickId)
        });
    }

    // Cancel this event
    const handleCancelEvent = () => {
        const deleteEvent = async() => {
            fetch(serverUrl + `delete/${eventCode}`);
            navigate("/");
        }
        deleteEvent();
    }

    // Connect to server on load to receive push events when a player joins
    useEffect(() => {
        // Create and link to a tournament on the server
        const createTournament = async() => {
            await fetch(serverUrl + "create")
            .then(response => response.json())
            .then(response => setEventCode(response.code))
            .catch(err => {
                console.log(err);
                navigate("/", {state: {error: true, emsg: "The tournament could not be created"}});
            })
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
            <h1>Event: {eventCode}</h1>
            <h2>Players</h2>
            <ul>
                {players.map((player) => (
                    <li key={player.id} data-id={player.id}><span>{player.name}</span> <input type="button" name="kick" id="kick" value="X" onClick={handleKickPlayer} /></li>
                ))}
            </ul>
            <form>
                <input type="button" name="start" id="start" value="Start Event" />
                <input type="button" name="delete" id="delete" value="Cancel Event" onClick={handleCancelEvent}/>
            </form>
        </div>
    );
}

export default HostSetup;