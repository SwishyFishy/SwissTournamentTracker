import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";

import { Player } from "../types";
import { CONTEXT_serverBaseUrl } from "../main";
import KickButton from "../components/KickButton";

import CreateConnection from "../functions/server_liaison";

import '../styles/HostSetup.css';

function HostSetup(): JSX.Element
{
    const [players, setPlayers] = useState<Array<Player>>([]);
    const [eventCode, setEventCode] = useState("");

    const serverUrl: string = useContext(CONTEXT_serverBaseUrl);
    const navigate = useNavigate();

    // Start this event
    const handleStartEvent = () => {
        console.log("Event registered");
        fetch(serverUrl + `/start/${eventCode}`)
        .then(response => {
            console.log("fetch executed");
            console.log(response);
            if (response.ok)
            {
                navigate(`/host/${eventCode}`);
            }
            else
            {
                throw new Error;
            }
        })
        .catch((err) =>{
            console.log(err);
        })
    }

    // Cancel this event
    const handleCancelEvent = () => {
        fetch(serverUrl + `/delete/${eventCode}`)
        .catch((err) => {
            console.log(err);
        })
        navigate("/");
    }

    // Connect to server on load to receive push events when a player joins
    useEffect(() => {
        fetch(serverUrl + "/create")
        .then(response => response.json())
        .then(response => {
            setEventCode(response.code)
            // Create the connection to the server
            // Use the name "" because it is not allowed for players
            CreateConnection(serverUrl, response.code, "",
                (data: any) => {
                    if (data.players !== undefined)
                    {
                        setPlayers(data.players);
                    }
                    else
                    {
                        setPlayers([]);
                    }
                },
                () => { return false; }
            )})
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