const express = require("express");
const app = express();

const port = 1234;

app.get("/", (req, res) => {
    res.send("Hello World!");
})

// Include ip address in listen - does it work on not Trent network?

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});