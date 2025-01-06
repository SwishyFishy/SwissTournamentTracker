import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";

import { PlayerStats } from "../types";

import { CONTEXT_serverBaseUrl } from "../main";

import '../styles/Leaderboard.css';

function Leaderboard() 
{
    const [results, setResults] = useState<Array<PlayerStats>>([]);    
    const serverURL: string = useContext(CONTEXT_serverBaseUrl);
    const eventCode = useLocation().state.code;

    // Get leaderboard
    useEffect(() => {
        const getLeaderboard = async() => {
            await fetch(serverURL + `/leaderboard/${eventCode}`)
            .then(response => response.json())
            .then(response => setResults(response.leaderboard))
            .catch((err) => {
                console.log(err);
            })
        }
        getLeaderboard();
    }, [])

    return(
        <div className="wrapper leaderboard">
            <h1>Results: </h1>
            <ul>
                <li className="headerRow">
                    <span>Player</span>
                    <span>Pts</span>
                    <span>Record</span>
                    <span>OMW</span>
                    <span>GW</span>
                    <span>OGW</span>
                </li>
                {results.map((result) => ( 
                    <li key={result.id}>
                        <span>{result.name}</span>
                        <span>{result.points}</span>
                        <span>{result.wins} - {result.losses} - {result.draws}</span>
                        <span>{result.omw.toFixed(3)}</span>
                        <span>{result.gw.toFixed(3)}</span>
                        <span>{result.ogw.toFixed(3)}</span>
                    </li>
                ))}
            </ul>
            <form>

            </form>
        </div>
    );
}   

export default Leaderboard;