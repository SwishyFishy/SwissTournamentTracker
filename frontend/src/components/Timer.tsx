import { useState, useEffect } from "react";

import '../styles/Timer.css';

interface props_Timer
{
    timeMinutes: number;
}

function Timer({timeMinutes}: props_Timer): JSX.Element
{
    const targetTime = useState<number>(Date.now() + (timeMinutes * 60000))[0];
    const warningTime = 5;

    const [currentTime, setCurrentTime] = useState<number>(Date.now());
    const [roundOver, setRoundOver] = useState<boolean>(false);

    // Create an interval that checks whether the time exceeds the target time, and updates the screen, every second
    useEffect(() => {
        setInterval(() => {
            setCurrentTime(Date.now());
            if (currentTime >= targetTime)
            {
                setRoundOver(true);
            }
        }, 1000)
    }, [])

    return(
        <p className={roundOver ? "red" : ((targetTime - currentTime) / 60000 < warningTime ? "green" : "yellow")}>
            {Math.floor((targetTime - currentTime) / 60000)}:{(Math.floor((targetTime - currentTime) / 1000) % 60).toLocaleString('en-US', {minimumIntegerDigits: 2})}
        </p>
    );
}

export default Timer;