import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";

import { Player, SubscribedData } from "../types";
import { CONTEXT_serverBaseUrl } from "../main";
import KickButton from "../components/KickButton";

import ServerConnection from "../functions/server_liaison";

import '../styles/HostSetup.css';

function HostSetup(): JSX.Element
{
    const [players, setPlayers] = useState<Array<Player>>([]);
    const [eventCode, setEventCode] = useState("");
    const [connection, setConnection] = useState<ServerConnection | undefined>(undefined);

    const serverUrl: string = useContext(CONTEXT_serverBaseUrl);
    const navigate = useNavigate();

    // Start this event
    const handleStartEvent = () => {
        fetch(serverUrl + `/start/${eventCode}`)
        .then(() => {
            ServerConnection.disconnect(connection!);
            navigate(`/host/${eventCode}`);
        })
        .catch((err) =>{
            console.log(err);
        })
    }

    // Cancel this event
    const handleCancelEvent = () => {
        fetch(serverUrl + `/delete/${eventCode}`)
        .then(() => {
            navigate("/");
        })
        .catch((err) => {
            console.log(err);
        })
    }

    // Connect to server on load to receive push events when a player joins
    useEffect(() => {
        fetch(serverUrl + "/create")
        .then(response => response.json())
        .then(response => {
            setEventCode(response.code)
            setConnection(new ServerConnection(serverUrl, response.code, (data: SubscribedData) => {
                data.players !== undefined ? setPlayers(data.players) : setPlayers([]);
            }));
        })
        .catch(err => {
            console.log(err);
            navigate("/", {state: {error: true, emsg: "The tournament could not be created"}});
        })
    }, []);

    return(
        <div className="wrapper hostSetup">
            <h1>Event: {eventCode}</h1>
            <h2>Players</h2>
            <ul>
                {players.map((player) => (
                    <li><span>{player.name}</span> <KickButton player={player.name} eventCode={eventCode} /></li>
                ))}
            </ul>
            <form>
                <input type="button" name="start" id="start" value="Start Event" onClick={handleStartEvent} />
                <input type="button" name="delete" id="delete" value="Cancel Event" onClick={handleCancelEvent}/>
            </form>
        </div>
    );
}

export default HostSetup;