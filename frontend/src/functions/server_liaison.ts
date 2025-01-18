import io from "socket.io-client";

import { SubscribedData } from "../types";

class ServerConnection
{
    // Data members
    __socket: SocketIOClient.Socket;

    // Constructor
    constructor(serverUrl: string, eventCode: string, callbackFn: Function)
    {
        this.__socket = io(`${serverUrl}/${eventCode}`);

        this.__socket.on("message", (data: SubscribedData) => {
            callbackFn(data);
        })
    }

    // Public methods
    // Tell the server to broadcast a message
    broadcast(msg: string): void
    {
        this.__socket.emit("broadcast", msg)
    }

    // Tell the server to close the connection
    disconnect(): void
    {
        this.__socket.emit("close");
    }

    // Tell the server that it needs to push new tournament data to the other clients
    update(): void
    {
        this.__socket.emit("update");
    }
}

export default ServerConnection;