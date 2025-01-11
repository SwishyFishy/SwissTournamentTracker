import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router";

import Timer from "../components/Timer";
import KickButton from "../components/KickButton";

import { CONTEXT_serverBaseUrl } from "../main";
import { Match, SubscribedData } from "../types";

import "../styles/EventAdminHome.css";
import CreateConnection from "../functions/server_liaison";

function EventAdminHome(): JSX.Element
{
    const location = useLocation();
    const navigate = useNavigate();

    const serverUrl = useContext(CONTEXT_serverBaseUrl);
    const eventCode = location.state.code;

    const [eventDetails, setEventDetails] = useState<SubscribedData>();

    const [startRound, setStartRound] = useState<boolean>(false);
    const round_time: number = 50;

    // Start the round timer
    const handleStartRound = () => {
        setStartRound(true);
    }

    // Advance to the next round
    const handleAdvanceRound = () => {
        const advanceRound = async() => {
            await fetch(serverUrl + `/advance/${eventCode}`)
            .then(response => response.json())
            .then(response => {
                if (response.status == 'over')
                {
                    navigate("/event/conclusion", {state: {code: eventCode}});
                }
            })
            .catch((err) => {
                console.log(err);
            })

            // Reset this page
            setStartRound(false);
        }
        advanceRound();
    }

    // Edit player match scores
    const handleEditMatch = (e: any) => {
        const editMatch = async(e: any) => {
            // Match the event target to a match in state
            const eplayer: string = e.target.getAttribute('id');
            const match: Match = eventDetails!.matches!.find((match) => match.p1 == eplayer || match.p2 == eplayer)!;

            // Send a request to record a new round score for that match, with the clicked player's score incremented by 1 (mod 3);
            // Result: Each score can be clicked to increment by 1, rolling over 0 -> 1 -> 2 -> 0
            const p1wins = match.p1 == eplayer ? (match.p1wins + 1) % 3 : match.p1wins;
            const p2wins = match.p2 == eplayer ? (match.p2wins + 1) % 3 : match.p2wins;
            
            await fetch(serverUrl + `/report/${eventCode}?p1=${match.p1}&p2=${match.p2}&p1wins=${p1wins}&p2wins=${[p2wins]}`)
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
        editMatch(e);
    }

    // Connect to the server on load
    useEffect(() => CreateConnection(serverUrl, eventCode, (data: SubscribedData) => {
        setEventDetails(data)
    }), []);

    return(
        <div className="wrapper eventAdminHome">
            <h1>Round: {eventDetails?.rounds?.currentRound} / {eventDetails?.rounds?.maxRound}</h1>
            {startRound ? <Timer timeMinutes={round_time} /> : <p>Round not started</p>}
            <ul>
                {eventDetails?.matches?.map((match) => ( 
                    <li key={match.p1 + match.p2}>
                        <KickButton key={match.p1 + "kick"} player={match.p1} eventCode={eventCode} callback={null} />
                        <span key={match.p1 + match.p2 + "col_p1"}>{match.p1}</span>
                        <span key={match.p1 + match.p2 + "col_p1wins"}>{match.p2wins !== undefined ? <input type="button" name="p1wins" id={match.p1} value={match.p1wins} onClick={handleEditMatch} /> : <span className="bye">2</span>}</span>
                        <span key={match.p1 + match.p2 + "col_vs"}>-</span>
                        <span key={match.p1 + match.p2 + "col_p2wins"}>{match.p2wins !== undefined ? <input type="button" name="p2wins" id={match.p2} value={match.p2wins} onClick={handleEditMatch} /> : <span className="bye">0</span>}</span>
                        <span key={match.p1 + match.p2 + "col_p2"}>{match.p2 ? match.p2 : "Bye"}</span>
                        <KickButton key={match.p2 + "kick"} player={match.p2} eventCode={eventCode} callback={null} />
                    </li>
                ))}
            </ul>
            <form>
                <input type="button" name="start" id="start" value="Start Round" className={startRound ? "hidden" : ""} onClick={handleStartRound} />
                <input type="button" name="next" id="next" value="Next Round" className={startRound ? "" : "hidden"} onClick={handleAdvanceRound} />
            </form>
        </div>
    );
}

export default EventAdminHome;