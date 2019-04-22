const initialState = {
    user: null,
    guilds: null,
    showCard: false,
    loadingGuilds: false,
    loadedGuilds: false,
    selectedGuild: null,
    selectedGuildData: null,
    loadingGuild: false,
    loadedGuild: false,
    redirecting: false,
};

const reducer = (state = initialState, action) => {
    console.log("Reduce", state, action);
    let newState = Object.assign({}, state);

    switch(action.type) {

        case "BOT_REDIRECT_DONE": {
            newState.redirecting = false;
            return newState;
        }
        case "BOT_REDIRECT_CLICKED": {
            newState.redirecting = true;
            return newState;
        }
        case "CORE_GUILD_LOADED": {
            newState.loadingGuild = false;
            newState.loadedGuild = true;
            newState.selectedGuildData = action.data;
            return newState;
        }
        case "CORE_GUILD_LOADING": {
            newState.redirecting = false;
            newState.loadingGuild = true;
            newState.loadedGuild = false;
            newState.selectedGuildData = null;
            return newState;
        }
        case "GUILD_SELECTED": {
            newState.selectedGuild = action.data;
            return newState;
        }
        case "GUILDS_LOADED": {
            newState.guilds = action.data;
            if(action.data !== null) {
                newState.guilds.sort((a,b) => {
                    let aP = (a.permissions & 0x00000008) === 0x00000008;
                    let bP = (b.permissions & 0x00000008) === 0x00000008;

                    if(aP && !bP)
                        return -1;
                    else if(bP && !aP)
                        return 1;
                    else
                        return 0;
                });
            }
            newState.loadingGuilds = false;
            newState.loadedGuilds = true;
            return newState;
        }
        case "LOADING_GUILDS": {
            newState.loadingGuilds = true;
            newState.loadedGuilds = false;
            return newState;
        }
        case "USERCARD_DECLICK": {
            newState.showCard = false;
            return newState;
        }
        case "USERCARD_CLICK": {
            newState.showCard = true;
            return newState;
        }
        case "USER_FETCHED": {
            newState.user = action.data;
            return newState;
        }
        default:
            return newState;
    }


};

export default reducer;