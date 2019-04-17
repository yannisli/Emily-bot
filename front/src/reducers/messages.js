const initialState = {
    data: null,
    loading: false,
    loaded: false
};

const reducer = (state = initialState, action) => {
    console.log("Messages Reduce", state, action);
    let newState = Object.assign({}, state);

    switch(action.type) {
        case "GUILD_LOADED": {
            newState.loading = false;
            newState.loaded = true;
            newState.data = action.data;
            return newState;
        }
        case "LOADING_GUILD": {
            newState.loading = true;
            newState.loaded = false;
            return newState;
        }
        default:
            return newState;
    }
};

export default reducer;