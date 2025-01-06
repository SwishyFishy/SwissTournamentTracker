import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";

import { PlayerStats } from "../types";

import { CONTEXT_serverBaseUrl } from "../main";

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
        <div className="wrapper leaderboardHome">
            <h1>Results: </h1>
            <ul>
                {results.map((result) => ( 
                    <li key={result.id}>
                        
                    </li>
                ))}
            </ul>
            <form>

            </form>
        </div>
    );
}   

export default Leaderboard;