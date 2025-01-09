import { useContext } from "react"

import { CONTEXT_serverBaseUrl } from "../main"

function CreateConnection(storeData: Function)
{
    const serverUrl: string = useContext(CONTEXT_serverBaseUrl);

    // Connect to the server 
    const events: EventSource = new EventSource(serverUrl + `/subscribe`);
    events.onmessage = (e) => {
        const data = JSON.parse(e.data);
        storeData(data);
    }
}

export default CreateConnection;