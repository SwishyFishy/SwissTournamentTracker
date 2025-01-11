import '../styles/MatchPanel.css';

interface props_MatchPanel
{
    player: string
    wins: number
    callbackFn: Function
}

function MatchPanel({player, wins, callbackFn}: props_MatchPanel)
{
    // Button functionality
    const handleIncrementScore = () => {
        if (wins <= 2)
        {
            callbackFn(wins + 1);
        }
    }

    const handleDecrementScore = () => {
        if (wins >= 0)
        {
            callbackFn(wins - 1);
        }
    }

    return(
        <div id="matchPanel">
            <h1>{player}</h1>
            <input type="button" name="increment" id="increment" value="▵" onClick={handleIncrementScore} />
            <span>{wins}</span>
            <input type="button" name="decrement" id="decrement" value="▿" onClick={handleDecrementScore} />
        </div>
    );
}

export default MatchPanel;