import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router";

import { Match } from "../types";

import { CONTEXT_serverBaseUrl } from "../main";

import "../styles/EventAdminHome.css";

function EventAdminHome(): JSX.Element
{
    const [round, setRound] = useState<number>(0);
    const [maxRound, setMaxRound] = useState<number>(0);
    const [matches, setMatches] = useState<Array<Match>>([]);
    const serverUrl = useContext(CONTEXT_serverBaseUrl);
    const eventCode = useLocation().state.code;

    // Get the current round match records
    const handleRefreshMatches = () => {
        const getRound = async() => {
            await fetch(serverUrl + `/round/${eventCode}`)
            .then(response => response.json())
            .then(response => {
                setRound(response.round.currentRound);
                setMaxRound(response.round.maxRound);
                setMatches(response.matches);
            })
            .catch((err) => {
                console.log(err);
            })
        }
        getRound();
    }

    // Load matches on component mount
    useEffect(() => handleRefreshMatches(), []);

    return(
        <div className="wrapper eventAdminHome">
            <h1>Round: {round} / {maxRound}</h1>
            <ul>
                {matches.map((match) => ( 
                    <li key={match.p1 + match.p2}>
                        <span key={match.p1 + match.p2 + "col_p1"}>{match.p1}</span>
                        <span key={match.p1 + match.p2 + "col_p1wins"}>{match.p1wins}</span>
                        <span key={match.p1 + match.p2 + "col_vs"}>-</span>
                        <span key={match.p1 + match.p2 + "col_p2"}>{match.p2wins ? match.p2wins : 0}</span>
                        <span key={match.p1 + match.p2 + "col_p2wins"}>{match.p2 ? match.p2 : "Bye"}</span>
                    </li>
                ))}
            </ul>
            <form>
                <input type="button" name="refresh" id="refresh" value="Refresh" onClick={handleRefreshMatches} />
                <input type="button" name="next" id="next" value="Next Round" />
            </form>
        </div>
    );
}

export default EventAdminHome;