import { useContext, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";

import { Leaderboard } from "../types";

import { CONTEXT_serverBaseUrl } from "../main";

import '../styles/DisplayLeaderboard.css';

function DisplayLeaderboard() 
{
    const [results, setResults] = useState<Leaderboard>([]);  

    const serverURL: string = useContext(CONTEXT_serverBaseUrl);

    let {eventCode} = useParams();
    eventCode = eventCode!;
    const player: string = useSearchParams()[0].get("player")!;

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
        <div className="wrapper" id="displayLeaderboard">
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
                        <span className={result.name == player ? "highlight" : ""}>{result.name}</span>
                        <span>{result.points}</span>
                        <span>{result.wins} - {result.losses} - {result.draws}</span>
                        <span>{result.omw.toFixed(3)}</span>
                        <span>{result.gw.toFixed(3)}</span>
                        <span>{result.ogw.toFixed(3)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}   

export default DisplayLeaderboard;