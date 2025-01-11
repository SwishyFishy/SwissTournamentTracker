interface props_MatchPanel
{
    player: string
    pid: string
    wins: number
    callbackFn: Function
}

function MatchPanel({player, pid, wins, callbackFn}: props_MatchPanel)
{
    // Button functionality
    const handleIncrementScore = () => {
        if (wins <= 2)
        {
            callbackFn(pid, wins + 1);
        }
    }

    const handleDecrementScore = () => {
        if (wins >= 0)
        {
            callbackFn(pid, wins - 1);
        }
    }

    return(
        <div className="matchPanel">
            <h1>{player}</h1>
            <input type="button" name="increment" id="increment" value="▵" onClick={handleIncrementScore} />
            <span>{wins}</span>
            <input type="button" name="decrement" id="decrement" value="▿" onClick={handleDecrementScore} />
        </div>
    );
}

export default MatchPanel;