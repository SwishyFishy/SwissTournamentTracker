import { useContext } from "react";

import { CONTEXT_serverBaseUrl } from "../main";

import '../styles/KickButton.css';

interface props_KickButton
{
    player: string,
    eventCode: string,
    callback: Function | null
}

function KickButton({player, eventCode, callback}: props_KickButton): JSX.Element
{
    const serverUrl = useContext(CONTEXT_serverBaseUrl);
    
    // Kick a player using the X button
    const handleKickPlayer = () => {
        const kickPlayer = async() => {
            await fetch(serverUrl + `/leave/${eventCode}?name=${player}`)
            .then(response => {
                if (response.status == 409)
                {
                    fetch(serverUrl + `/drop/${eventCode}?name=${player}`)
                    .catch((err) => {
                        console.log(err);
                    })
                }
            })
            .catch(err => {
                console.log(err);
            })
        };
        kickPlayer();

        if (callback !== null) 
        {
            callback();        
        }
    }

    return(
        <input type="button" name={"kick" + player} id={"kick" + player} className="kickButton" value="X" onClick={handleKickPlayer} />
    );
}

export default KickButton;