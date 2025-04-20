import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

import MatchPanel from "../components/MatchPanel";
import Timer from "../components/Timer";

import { CONTEXT_serverBaseUrl } from "../main";
import { CONTEXT_eventDetails } from "./EventSubscriber";
import { Match } from "../types";

import '../styles/EventParticipantMatch.css';

function EventParticipantMatch(): JSX.Element
{
    const [startRound, setStartRound] = useState<boolean>(false);
    const round_time: number = 50;

    const serverUrl = useContext(CONTEXT_serverBaseUrl);
    const eventDetails = useContext(CONTEXT_eventDetails);

    const {eventCode} = useParams() as {eventCode: string};
    const player: string = useSearchParams()[0].get("player")!;
    
    const navigate = useNavigate();

    // Should probably fix my types such that I don't need to use the ! non-null, non-undefined assertion
    const match: Match = eventDetails.matches!.find((match) => match.p1 == player || match.p2 == player)!;
    const round = eventDetails.rounds?.currentRound;
    const [p1Score, setp1Score] = useState<number>(match.p1wins);
    const [p2Score, setp2Score] = useState<number>(match.p2wins);

    // Immediately forward the player to the postmatch page if they have the bye
    if (match.p1 == match.p2)
    {
        navigate(`/${eventCode}/postmatch?player=${player}`);
    }

    // Score submission
    const handleSubmitScore = () => {
        fetch(serverUrl + `/report/${eventCode}?p1=${match.p1}&p2=${match.p2}&p1wins=${p1Score}&p2wins=${p2Score}`)
        .then(response => { 
            if (response.ok) 
            { 
                navigate(`/${eventCode}/postmatch?player=${player}`);
            }
            else
            {
                console.log(response);
                setp1Score(0);
                setp2Score(0);
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }

    // Monitor for the message broadcast that the round has started
    // Monitor for match submission from either player, then redirect to postmatch page
    useEffect(() => {
        if (eventDetails.status == "over")
        {
            navigate(`/${eventCode}/conclusion?player=${player}`);
        }
        else if (eventDetails.message == "round_start")
        {
            setStartRound(true);
        }
        else
        {
            const match: Match = eventDetails.matches!.find((match) => match.p1 == player || match.p2 == player)!
            if (match.reported)
            {
                navigate(`/${eventCode}/postmatch?player=${player}`);
            }
        }
    }, [eventDetails])

    return(
        <div className="wrapper" id="eventParticipantMatch">
            <h1>Round {round}</h1>
            {startRound ? <Timer timeMinutes={round_time} /> : <p>Round not started</p>}
            <form className="playerPairings">
                <MatchPanel player={match.p1} wins={p1Score} setScore={setp1Score} />
                <MatchPanel player={match.p2} wins={p2Score} setScore={setp2Score} />
                <input type="button" name="submit" id="submit" value="Submit Match Score" onClick={handleSubmitScore} />
            </form>
        </div>
    );
}

export default EventParticipantMatch;