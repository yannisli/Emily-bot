const express = require("express");

const { GetUserTokens } = require("./oauth2");

const { CatchAsync, DiscordGet } = require("../utils");

const router = express.Router();



router.get("/@me", CatchAsync(async (req, res) => {
    const tokens = await GetUserTokens(req, res);
    if(!tokens) {
        res.sendStatus(401);
        return;
    }
    
    const user = await DiscordGet(`https://discordapp.com/api/users/@me`, `Bearer ${tokens.access_token}`);
    if(typeof(user) !== "object")
        res.sendStatus(user);
    else
        res.status(200).json(user);

    
}));

router.get("/@me/guilds", CatchAsync(async (req, res) => {
    // Check Validation
    const tokens = await GetUserTokens(req, res);
    if(!tokens) {
        res.sendStatus(401);
        return;
    }
    const guilds = await DiscordGet(`https://discordapp.com/api/users/@me/guilds`, `Bearer ${tokens.access_token}`);

    if(typeof(guilds) !== "object")
        res.sendStatus(guilds);
    else
        res.status(200).json(guilds);
}));

router.get("*", (req, res) => res.sendStatus(404));

module.exports = router;