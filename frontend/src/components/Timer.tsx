import { useState, useEffect } from "react";

interface props_Timer
{
    timeMinutes: number;
}

function Timer({timeMinutes}: props_Timer)
{
    const [currentTime, setCurrentTime] = useState<number>(Date.now());
    const [targetTime, setTargetTime] = useState<number>(Date.now() + (timeMinutes * 60000));
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
        <p className={roundOver ? "red" : "green"}>
            {Math.floor((targetTime - currentTime) / 60000)}:{(Math.floor((targetTime - currentTime) / 1000) % 60).toLocaleString('en-US', {minimumIntegerDigits: 2})}
        </p>
    );
}

export default Timer;