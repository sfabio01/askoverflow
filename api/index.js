const clientId = 20981;
const scope = "write_access";
const baseUrl = "https://xeyuug.deta.dev";

const clientSecret = require("./secret");
const express = require('express');
const request = require('request');
const app = express();

app.get("/debug", (req, res) => {
    res.end("DEBUG PAGE WORKING");
});

app.get("/redirect", (req, res) => {
    let code = req.query.code;
    if (code) {
        const options = {
            url: "https://stackoverflow.com/oauth/access_token/json?client_id=" + clientId + "&client_secret=" + clientSecret + "&code=" + code + "&redirect_uri=" + encodeURI(baseUrl) + "/redirect",
            method: 'POST'
        };

        request(options, (err, _, body) => {
            let data = JSON.parse(body);
            const token = data.access_token;
            res.redirect("http://localhost:56789/auth/" + token);
        });


    } else {
        res.end("received code is empty");
    }

});

app.get("/auth", (req, res) => {
    res.redirect("https://stackoverflow.com/oauth?client_id=" + clientId + "&scope=" + scope + "&redirect_uri=" + encodeURI(baseUrl) + "/redirect");

});

module.exports = app;