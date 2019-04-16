let initialState = {
    user: null,
    guilds: null,
    showCard: false,
    loadingGuilds: false,
    loadedGuilds: false,
};

const reducer = (state = initialState, action) => {
    console.log("Core Reduce", state, action);
    let newState = Object.assign({}, state);

    switch(action.type) {
        case "GUILDS_FETCHED": {
            newState.guilds = action.data;
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