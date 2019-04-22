const express = require("express");
const fetch = require("node-fetch");
const btoa = require("btoa");
const cookie = require("cookie");

const router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;


const discordCallbackURI = require("../utils").GetDiscordURI();

const { CatchAsync } = require("../utils");


const GetUserTokens = async (req, res) => {
    if(!req.headers || !req.headers.cookie)
        return false;
    
    const cookies = cookie.parse(req.headers.cookie);

    if(!cookies || !cookies.access_token || !cookies.refresh_token) {
        return false;
    }

    const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    const response = await fetch(`https://discordapp.com/api/users/@me`,
    {
        method: "GET",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${cookies.access_token}`
        }
    });
    if(response.status === 401)
    {
        const refresh = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=refresh_token&refresh_token=${cookies.refresh_token}&scope=identify%20guilds&redirect_uri=${discordCallbackURI}`,
        {
            method: "POST",
            headers: {
                "Authorization": `Basic ${credentials}`
            }
        });
        if(!refresh.ok)
            return false;
        
        const json = await refresh.json();

        res.cookie("access_token", json.access_token, {httpOnly: true, maxAge: json.expires_in * 1000});
        res.cookie("refresh_token", json.refresh_token, {httpOnly: true, maxAge: json.expires_in * 3000});

        return {access_token: json.access_token, refresh_token: json.refresh_token};
    }
    else
    {
        if(response.ok) {
            return {access_token: cookies.access_token, refresh_token: cookies.refresh_token};
        }
        else
            return false;
    }
    
}

router.get("/login", (req, res) => {
    res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify%20guilds&response_type=code&redirect_uri=${discordCallbackURI}`);
});

router.get("/logout", CatchAsync(async (req, res) => {
    const tokens = await GetUserTokens(req, res);
    if(!tokens) {
        res.sendStatus(401);
        return;
    }
    const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    const response = await fetch(`https://discordapp.com/api/oauth2/token/revoke?token=${tokens.access_token}`,
    {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${credentials}`
        }
    });

    if(response.ok)
    {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        res.redirect("/");
    }
    else
    {
        console.log("Revocation error", response.status);
        res.sendStatus(response.status);
    }
}));

router.get("/callback", CatchAsync(async (req, res) => {
    if(!req.query.code) {
        res.status(500).send("No code provided");
        return;
    }
    const code = req.query.code;
    const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${discordCallbackURI}`,
    {
        method: "POST",
        headers: {
            Authorization: `Basic ${credentials}`,
        }
    });
    const json = await response.json();
    // Save Access_Token as a cookie
    res.cookie("access_token", json.access_token, {httpOnly: true, maxAge: json.expires_in * 1000});
    res.cookie("refresh_token", json.refresh_token, {httpOnly: true, maxAge: json.expires_in * 3000});
    res.redirect(301, `/`);
}));

router.get("*", (req, res) => res.sendStatus(404)); 

exports.Router = router;
exports.GetUserTokens = GetUserTokens;