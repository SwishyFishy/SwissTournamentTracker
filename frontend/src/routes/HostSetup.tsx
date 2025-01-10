import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";

import { Player } from "../types";
import { CONTEXT_serverBaseUrl } from "../main";
import KickButton from "../components/KickButton";

import '../styles/HostSetup.css';

function HostSetup(): JSX.Element
{
    const [players, setPlayers] = useState<Array<Player>>([]);
    const [eventCode, setEventCode] = useState("");
    const serverUrl: string = useContext(CONTEXT_serverBaseUrl);
    const navigate = useNavigate();

    // Get and set the player list
    const handleRefreshParticipants = () => {
        const getPlayers = async() => {
            await fetch(serverUrl + `/list/${eventCode}`)
            .then(response => response.json())
            .then(response => setPlayers(response.players))
            .catch(err => {
                console.log(err);
                setPlayers([{id: '0', name: 'Network Error - unable to fetch player list'}])
            })
        };

        getPlayers();
    };

    // Start this event
    const handleStartEvent = () => {
        const startEvent = async() => {
            await fetch(serverUrl + `/start/${eventCode}`)
            .then(response => {
                if (response.ok)
                {
                    navigate("/host/event", {state: {code: eventCode}} )
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
        startEvent();
    }

    // Cancel this event
    const handleCancelEvent = () => {
        const deleteEvent = async() => {
            fetch(serverUrl + `/delete/${eventCode}`);
            navigate("/");
        };

        deleteEvent();
    }

    // Connect to server on load to receive push events when a player joins
    useEffect(() => {
        // Create and link to a tournament on the server
        const createTournament = async() => {
            await fetch(serverUrl + "/create")
            .then(response => response.json())
            .then(response => setEventCode(response.code))
            .catch(err => {
                console.log(err);
                navigate("/", {state: {error: true, emsg: "The tournament could not be created"}});
            })
        };

        createTournament();
    }, []);

    return(
        <div className="wrapper hostSetup">
            <h1>Event: {eventCode}</h1>
            <h2>Players</h2>
            <ul>
                {players.map((player) => (
                    <li key={player.id}><span key={player.id + player.name}>{player.name}</span> <KickButton key={"kick" + player.id} player={player.name} eventCode={eventCode} callback={handleRefreshParticipants}/></li>
                ))}
            </ul>
            <form>
                <input type="button" name="refresh" id="refresh" value="Refresh" onClick={handleRefreshParticipants} />
                <input type="button" name="start" id="start" value="Start Event" onClick={handleStartEvent} />
                <input type="button" name="delete" id="delete" value="Cancel Event" onClick={handleCancelEvent}/>
            </form>
        </div>
    );
}

export default HostSetup;