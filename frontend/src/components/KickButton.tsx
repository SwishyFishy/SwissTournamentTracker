import { useContext } from "react";

import { CONTEXT_serverBaseUrl } from "../main";

import '../styles/KickButton.css';

interface props_KickButton
{
    player: string,
    eventCode: string,
}

function KickButton({player, eventCode}: props_KickButton): JSX.Element
{
    const serverUrl = useContext(CONTEXT_serverBaseUrl);
    
    // Kick a player using the X button
    // Attempt to remove the playuer from the tournament - if the resposne code is 409, then the tournament has started, and the player must be dropped instead
    const handleKickPlayer = () => {
        fetch(serverUrl + `/leave/${eventCode}?name=${player}`)
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
    }

    return(
        <input key={"kick" + player} type="button" name={"kick" + player} id={"kick" + player} className="kickButton" value="X" onClick={handleKickPlayer} />
    );
}

export default KickButton;