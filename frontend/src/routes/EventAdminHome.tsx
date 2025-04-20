import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";

import Timer from "../components/Timer";
import KickButton from "../components/KickButton";

import { CONTEXT_serverBaseUrl } from "../main";
import { Match, SubscribedData } from "../types";
import ServerConnection from "../functions/server_liaison";

import "../styles/EventAdminHome.css";

function EventAdminHome(): JSX.Element
{
    const navigate = useNavigate();
    const serverUrl = useContext(CONTEXT_serverBaseUrl);
    const {eventCode} = useParams() as {eventCode: string};

    const [eventDetails, setEventDetails] = useState<SubscribedData>();
    const [startRound, setStartRound] = useState<boolean>(false);
    const [connection, setConnection] = useState<ServerConnection | undefined>(undefined);
    const round_time: number = 50;

    useEffect(() => {
        setConnection(new ServerConnection(serverUrl, eventCode, (data: SubscribedData) => {
            setEventDetails({...data});
            if (data.message == "round_start")
            {
                setStartRound(true);
            }
        }));
    }, []);

    // Edit player match scores
    const handleEditMatch = (e: any) => {
        // Match the event target to a match in state
        const eplayer: string = e.target.getAttribute('id');
        const match: Match = eventDetails!.matches!.find((match) => match.p1 == eplayer || match.p2 == eplayer)!;
        
        // Send a request to record a new round score for that match, with the clicked player's score incremented by 1 (mod 3);
        // Result: Each score can be clicked to increment by 1, rolling over 0 -> 1 -> 2 -> 0
        const p1wins = match.p1 == eplayer ? (match.p1wins + 1) % 3 : match.p1wins;
        const p2wins = match.p2 == eplayer ? (match.p2wins + 1) % 3 : match.p2wins;
        
        fetch(serverUrl + `/report/${eventCode}?p1=${match.p1}&p2=${match.p2}&p1wins=${p1wins}&p2wins=${[p2wins]}`)
        .then(response => { 
            if (!response.ok) 
            { 
                console.log(response) 
            } 
        })
        .catch((err) => {
            console.log(err);
        })
    }

    // Start the round timer
    const handleStartRound = () => {
        connection!.update("round_start");
    }
    
    // Advance to the next round
    const handleAdvanceRound = () => {
        fetch(serverUrl + `/advance/${eventCode}`)
        .then(response => response.json())
        .then(response => {
            if (response.status == "over")
            {
                navigate(`/${eventCode}/conclusion?player=`);
            }
        })
        .catch((err) => {
            console.log(err);
        })

        setStartRound(false);
    }

    return(
        <div className="wrapper eventAdminHome">
            <h1>Round: {eventDetails?.rounds?.currentRound} / {eventDetails?.rounds?.maxRound}</h1>
            {startRound ? <Timer timeMinutes={round_time} /> : <p>Round not started</p>}
            <ul>
                {eventDetails?.matches?.map((match) => ( 
                    <li key={match.p1 + match.p2}>
                        <KickButton player={match.p1} eventCode={eventCode} />
                        <span className={eventDetails.players?.find((player) => player.name == match.p1)!.dropped ? "dropped" : ""}>{match.p1}</span>
                        <span>{match.p2wins !== undefined ? <input type="button" name="p1wins" id={match.p1} value={match.p1wins} onClick={handleEditMatch} /> : <span className="bye">2</span>}</span>
                        <span>-</span>
                        <span>{match.p2wins !== undefined ? <input type="button" name="p2wins" id={match.p2} value={match.p2wins} onClick={handleEditMatch} /> : <span className="bye">0</span>}</span>
                        <span className={(match.p2 && eventDetails.players?.find((player) => player.name == match.p2)!.dropped) ? "dropped" : ""}>{match.p2 ? match.p2 : "Bye"}</span>
                        {match.p2 ? <KickButton player={match.p2} eventCode={eventCode} /> : <span key={"kick_bye"}></span>}
                    </li>
                ))}
            </ul>
            <form>
                <input type="button" name="start" id="start" value="Start Round" className={startRound ? "hidden" : ""} onClick={handleStartRound} />
                <input type="button" name="next" id="next" value={eventDetails === undefined || eventDetails!.rounds!.currentRound < eventDetails!.rounds!.maxRound ? "Next Round" : "End Tournament"} className={startRound ? "" : "hidden"} onClick={handleAdvanceRound} />
            </form>
        </div>
    );
}

export default EventAdminHome;