import { useContext } from "react";

import { CONTEXT_serverBaseUrl } from "../main";

import '../styles/KickButton.css';

interface props_KickButton
{
    player: string,
    eventCode: string,
    callback: Function | undefined
}

function KickButton({player, eventCode, callback}: props_KickButton): JSX.Element
{
    const serverUrl = useContext(CONTEXT_serverBaseUrl);
    
    // Kick a player using the X button
    const handleKickPlayer = () => {
        const kickPlayer = async() => {
            fetch(serverUrl + `/leave/${eventCode}?name=${player}`)
            .catch(err => {
                console.log(err);
            })
        };
        kickPlayer();

        if (callback !== undefined) 
        {
            callback();        
        }
    }

    return(
        <input type="button" name={"kick" + player} id={"kick" + player} className="kickButton" value="X" onClick={handleKickPlayer} />
    );
}

export default KickButton;