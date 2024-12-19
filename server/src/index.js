const express = require("express");
const app = express();

const {ipv4, port} = require("./private.js");

app.get("/", (req, res) => {
    res.send("Hello Again,  World!");
})

app.listen(port, ipv4, () => {
    console.log(`Server started on port ${port}`);
});

// Access via url = ipv4:port 