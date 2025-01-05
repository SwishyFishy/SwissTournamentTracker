import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router";

import { Match } from "../types";

import { CONTEXT_serverBaseUrl } from "../main";
import Timer from "../components/Timer";

import "../styles/EventAdminHome.css";

function EventAdminHome(): JSX.Element
{
    const [round, setRound] = useState<number>(0);
    const [maxRound, setMaxRound] = useState<number>(0);
    const [matches, setMatches] = useState<Array<Match>>([]);
    const [startRound, setStartRound] = useState<boolean>(false);
    const serverUrl = useContext(CONTEXT_serverBaseUrl);
    const eventCode = useLocation().state.code;
    const round_time: number = 50;

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
                if (response.status == 'Continue')
                {
                    handleRefreshMatches();
                }
                else
                {
                    // Navigate to tournament-over wrapup page
                    console.log(response.status);
                }
            })
            .catch((err) => {
                console.log(err);
            })
        }
        advanceRound();
    }

    // Edit player match scores
    const handleEditMatch = (e: any) => {
        const editMatch = async(e: any) => {
            // Match the event target to a match in state
            const eplayer: string = e.target.getAttribute('id');
            const match: Match | undefined = matches.find((match) => match.p1 == eplayer || match.p2 == eplayer);

            // Send a request to record a new round score for that match, with the clicked player's score incremented by 1 (mod 3);
            // Result: Each score can be clicked to increment by 1, rolling over 0 -> 1 -> 2 -> 0
            if (match !== undefined)
            {
                const p1wins = match.p1 == eplayer ? (match.p1wins + 1) % 3 : match.p1wins;
                const p2wins = match.p2 == eplayer ? (match.p2wins + 1) % 3 : match.p2wins;
                
                await fetch(serverUrl + `/report/${eventCode}?p1=${match.p1}&p2=${match.p2}&p1wins=${p1wins}&p2wins=${[p2wins]}`)
                .then(response => { if (response.ok){ handleRefreshMatches() } else { console.log(response) } })
                .catch((err) => {
                    console.log(err);
                })
            }
        }
        editMatch(e);
    }

    // Load matches on component mount
    useEffect(() => handleRefreshMatches(), []);

    return(
        <div className="wrapper eventAdminHome">
            <h1>Round: {round} / {maxRound}</h1>
            {startRound ? <Timer timeMinutes={round_time} /> : <p>Round not started</p>}
            <ul>
                {matches.map((match) => ( 
                    <li key={match.p1 + match.p2}>
                        <span key={match.p1 + match.p2 + "col_p1"}>{match.p1}</span>
                        <span key={match.p1 + match.p2 + "col_p1wins"}>{match.p2wins !== undefined ? <input type="button" name="p1wins" id={match.p1} value={match.p1wins} onClick={handleEditMatch} /> : <span className="bye">2</span>}</span>
                        <span key={match.p1 + match.p2 + "col_vs"}>-</span>
                        <span key={match.p1 + match.p2 + "col_p2wins"}>{match.p2wins !== undefined ? <input type="button" name="p2wins" id={match.p2} value={match.p2wins} onClick={handleEditMatch} /> : <span className="bye">0</span>}</span>
                        <span key={match.p1 + match.p2 + "col_p2"}>{match.p2 ? match.p2 : "Bye"}</span>
                    </li>
                ))}
            </ul>
            <form>
                <input type="button" name="refresh" id="refresh" value="Refresh" onClick={handleRefreshMatches} />
                <input type="button" name="start" id="start" value="Start Round" onClick={handleStartRound} />
                <input type="button" name="next" id="next" value="Next Round" onClick={handleAdvanceRound} />
            </form>
        </div>
    );
}

export default EventAdminHome;