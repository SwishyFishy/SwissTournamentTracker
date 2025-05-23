import { Match } from "../types";

import '../styles/MatchSummary.css';

interface props_MatchSummary
{
    match: Match
}

function MatchSummary({match}: props_MatchSummary): JSX.Element
{
    const p1WinsMatch: boolean = match.p1wins > match.p2wins;
    let winner: string, result: string, other: string, score: string;

    if (match.p2)
    {
        winner = p1WinsMatch ? match.p1 : match.p2;
        result = match.p1wins != match.p2wins ? "defeats" : "draws";
        other = p1WinsMatch ? match.p2 : match.p1;
        score = `${Math.max(match.p1wins, match.p2wins)} - ${Math.min(match.p1wins, match.p2wins)}`;
    }
    else
    { 
        winner = match.p1;
        result = "bye";
        other = "";
        score = "2 - 0";
    }

    return(
        <div id="matchSummary">    
            <span className="centered player">{winner}</span>
            <span className="centered">{result}</span>
            <span className="centered player">{other}</span>
            <span className="centered">{score}</span>
        </div>
    );
}

export default MatchSummary;