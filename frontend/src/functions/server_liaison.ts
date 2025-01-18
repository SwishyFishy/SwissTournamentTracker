import io from "socket.io-client";

import { SubscribedData } from "../types";

class ServerConnection
{
    // Data members
    __socket: SocketIOClient.Socket;

    // Constructor
    constructor(serverUrl: string, eventCode: string, callbackFn: Function)
    {
        this.__socket = io.connect(`${serverUrl}/${eventCode}`);

        this.__socket.on("receive_message", (data: SubscribedData) => {
            callbackFn(data);
        })
    }

    // Public methods
    // Close the connection
    disconnect(): void
    {
        this.__socket.emit("close");
    }
}

export default ServerConnection;