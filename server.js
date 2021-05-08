const express = require("express");
const CORS = require("cors");

const app = express();

app.use(CORS());

app.get("http://www.omdbapi.com/apikey.aspx", req, res) => {
    res.send(movies);
}
