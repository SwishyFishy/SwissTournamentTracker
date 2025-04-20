import io from "socket.io-client";

class ServerConnection
{
    // Data members
    __socket: SocketIOClient.Socket;

    // Constructor
    constructor(serverUrl: string, eventCode: string, callbackFn: Function)
    {
        this.__socket = io(`${serverUrl}/${eventCode}`);

        this.__socket.on("message", callbackFn);
    }

    // Public methods
    // Tell the server that it needs to push new tournament data to the other clients
    update(msg: string = ""): void
    {
        this.__socket.emit("update", msg);
    }

    // Static methods
    // Tell the server to close the connection
    static disconnect(connection: ServerConnection): void
    {
        connection.__socket.emit("close");
    }
}

export default ServerConnection;