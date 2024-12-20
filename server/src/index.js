// Get express
const express = require("express");
const app = express();

// Get required modules
const {ipv4, port} = require("./private.js");
const path = require("path");
const cors = require("cors");

// Define location of static files
app.use(express.static(__dirname + 'public'));
app.use(cors());

// Define responses
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "test.html"));
})

app.get("/submit", (req, res) => {
    res.send("Submitted!");
})

// Listen on port
app.listen(port, ipv4, () => {
    console.log(`Server started on port ${port}`);
    console.log(`${ipv4}:${port}`);
});