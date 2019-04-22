const fetch = require("node-fetch");


const getDiscordURI = () => {
    let port = process.env.PORT || 80;

    return encodeURIComponent(`${process.env.ROOT_URI || "http://localhost"}${port !== '80' ? `:${port}` : ""}/api/oauth2/callback`);
};

const catchAsync = fn => (req, res, next) => {
    Promise.resolve(fn(req,res,next)).catch(next);
};

const discordGet = async (uri, authorization=`Bot ${process.env.BOT_TOKEN}`) => {
    //console.log("DiscordGet(", uri, authorization, ")");
    const response = await fetch(uri, {
        method: "GET",
        headers: {
            'User-Agent': 'Emily (https://github.com/yannisli, 2.0)',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': authorization
        }
    });

    if(response.ok)
    {
        return await response.json();
    }
    else
    {
        //console.log(response.headers);
        return response.status;
    }
};

const validateSnowflake = snowflake => {

    if(Array.isArray(snowflake))
    {
        for(let i = 0 ; i < snowflake.length; i++)
        {
            for(let j = 0; j < snowflake[i].length; j++)
            {
                
                let int = parseInt(snowflake[i][j], 10);
                if(isNaN(int)) {
                    return false;
                }
            }
        }
        return true;
    }
    else if(typeof(snowflake) !== "string")
        return false;
    
    for(let i = 0; i < snowflake.length; i++)
    {
        let int = parseInt(snowflake[i], 10);
        if(isNaN(int))
            return false;
    }

    return true;

}
exports.GetDiscordURI = getDiscordURI;
exports.CatchAsync = catchAsync;
exports.DiscordGet = discordGet;
exports.ValidateSnowflake = validateSnowflake;