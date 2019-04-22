const express = require("express");

const { GetUserTokens } = require("./oauth2");

const { CatchAsync, DiscordGet, ValidateSnowflake } = require("../utils");

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
    let guilds = await DiscordGet(`https://discordapp.com/api/users/@me/guilds`, `Bearer ${tokens.access_token}`);

    if(typeof(guilds) !== "object")
        res.sendStatus(guilds);
    else {
        // Guilds is an array
        guilds.sort((a, b) => {
            let aN = a.name.toLowerCase();
            let bN = b.name.toLowerCase();
            return aN > bN ? 1 : (bN > aN) ? - 1 : 0;
        });
        res.status(200).json(guilds);
    }
}));

router.get("/guild/:id", CatchAsync(async (req, res) => {
    if(!await GetUserTokens(req, res))
    {
        res.sendStatus(401);
        return;
    }
    let guild_id = req.params.id;

    if(!ValidateSnowflake(guild_id))
    {
        res.sendStatus(400);
        return;
    }
    let guild = await DiscordGet(`https://discordapp.com/api/guilds/${guild_id}`);
    if(typeof(guild) !== "object")
        res.sendStatus(guild);
    else
        res.status(200).json(guild);
}));

router.get("/guild/:id/members", CatchAsync(async (req, res) => {

    let guild_id = req.params.id;

    console.log(req.query);
    
    let limit = req.query.limit || "1";
    let after = req.query.after || "0";

    if(after === 'undefined')
        after = '0';

    let results = await DiscordGet(`https://discordapp.com/api/guilds/${guild_id}/members?limit=${limit}&after=${after}`);

    if(typeof(results) !== "object")
        res.sendStatus(results);
    else
        res.status(200).json(results);
    
}));

router.get("/channels/:channel_id/messages", CatchAsync(async (req, res) => {

    let channel_id = req.params.channel_id;

    let before = req.query.before;

    let results = await DiscordGet(`https://discordapp.com/api/channels/${channel_id}/messages${before !== undefined ? `?before=${before}` : ""}`);

    if(typeof(results) !== "object")
        res.sendStatus(results);
    else
        res.status(200).json(results);
}));
router.get("*", (req, res) => res.sendStatus(404));

module.exports = router;