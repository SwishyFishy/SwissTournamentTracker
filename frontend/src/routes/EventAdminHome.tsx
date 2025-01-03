import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router";

import { Match } from "../types";

import { CONTEXT_serverBaseUrl } from "../main";

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
            <h2>Matches</h2>
            <table>
                <tr>
                    <th>Player</th>
                    <th>Wins</th>
                    <th>vs.</th>
                    <th>Wins</th>
                    <th>Player</th>
                </tr>
                {matches.map((match) => (
                    <tr>
                        <td>{match.p1.name}</td>
                        <td>{match.p1wins}</td>
                        <td>-</td>
                        <td>{match.p2wins}</td>
                        <td>{match.p2.name}</td>
                    </tr>
                ))}
            </table>
            <form>
                <input type="button" name="refresh" id="refresh" value="Refresh" onClick={handleRefreshMatches} />
                <input type="button" name="next" id="next" value="Next Round" />
            </form>
        </div>
    );
}

export default EventAdminHome;