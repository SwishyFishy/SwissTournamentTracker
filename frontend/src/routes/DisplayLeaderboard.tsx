import { useContext, useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";

import { Leaderboard } from "../types";

import { CONTEXT_serverBaseUrl } from "../main";

import '../styles/DisplayLeaderboard.css';

function DisplayLeaderboard(): JSX.Element
{
    const [results, setResults] = useState<Leaderboard>([]);  

    const serverUrl: string = useContext(CONTEXT_serverBaseUrl);

    const {eventCode} = useParams() as {eventCode: string};
    const player: string = useSearchParams()[0].get("player")!;

    const navigate = useNavigate();

    // Get leaderboard
    useEffect(() => {
        fetch(serverUrl + `/leaderboard/${eventCode}`)
        .then(response => response.json())
        .then(response => setResults(response.leaderboard))
        .catch((err) => {
            console.log(err);
        })
    }, [])

    // Home button
    const handleHome = () => {
        if (player == "")
        {
            fetch(serverUrl + `/silence/${eventCode}`);
            fetch(serverUrl + `/delete/${eventCode}`);
        }
        navigate("/");
    }

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
                        <span>{result.omw.toFixed(2)}%</span>
                        <span>{result.gw.toFixed(2)}%</span>
                        <span>{result.ogw.toFixed(2)}%</span>
                    </li>
                ))}
            </ul>
            <span className="italics">Scroll for more details</span>
            <input type="button" name="home" id="home" value={player == "" ? "End Tournament" : "Home"} onClick={handleHome} />
        </div>
    );
}   

export default DisplayLeaderboard;