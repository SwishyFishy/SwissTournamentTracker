import { useState } from "react";
import { useLocation } from "react-router";

import MatchPanel from "../components/MatchPanel";

function EventParticipantMatch(): JSX.Element
{
    const location = useLocation();
    const p1 = location.state.match.p1;
    const p2 = location.state.match.p2;
    const [p1Score, setp1Score] = useState<number>(location.state.match.p1wins);
    const [p2Score, setp2Score] = useState<number>(location.state.match.p2wins);

    return(
        <div className="wrapper eventParticipantMatch">
            <form>
                <MatchPanel player={p1} wins={p1Score} callbackFn={setp1Score} />
                <MatchPanel player={p2} wins={p2Score} callbackFn={setp2Score} />
                <input type="button" name="submit" id="submit" value="Submit Match Score" />
            </form>
        </div>
    );
}

export default EventParticipantMatch;