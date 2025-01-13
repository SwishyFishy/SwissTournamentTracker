// Create an event handler that calls the given callback function when messages are received from the /subscribe endpoint
function CreateConnection(serverUrl: string, eventCode: string, callbackFn: Function, closeCondition: Function)
{
    // Create an EventSource object to listen to the server
    const events: EventSource = new EventSource(serverUrl + `/subscribe/${eventCode}`);

    // When a message is recieved:
    //  Parse the data
    //  Check whether the closeCondition is true, and if so, close this connection
    //  Use the data
    events.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log(data);

        if (closeCondition())
        {
            events.close();
        }

        callbackFn(data);
    }
}

export default CreateConnection;