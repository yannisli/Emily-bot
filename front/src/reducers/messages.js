const initialState = {
    data: null,
    loading: false,
    loaded: false,
    creating: false,
    members: null,
    error: null
};

const reducer = (state = initialState, action) => {
    let newState = Object.assign({}, state);

    switch(action.type) {
        case "SET_ERROR": {
            newState.error = action.data;
            return newState;
        }
        case "MESSAGE_EDITED": {
            let newData = Object.assign({}, newState.data);

            newData.Messages[action.data.message].contents = action.data.newContents;

            newState.data = newData;
            return newState;
        }
        case "MESSAGE_DELETED": {
            let newData = Object.assign({}, newState.data);

            delete newData.Messages[action.data];

            newState.data = newData;
            return newState;
        }
        case "GUILD_MEMBERS_LOADED": {
            newState.members = action.data;
            return newState;
        }
        case "SET_CREATING": {
            newState.creating = action.data;
            return newState;
        }
        case "NEW_MESSAGE": {
            let newData = Object.assign({}, newState.data);

            newData.Messages[action.data.id] = action.data;

            newState.data = newData;
            
            return newState;
        }
        case "NEW_REACTION": {

            let newData = Object.assign({}, newState.data);

            newData.Messages[action.data.message].reactions.push(action.data.reaction);

            newState.data = newData;

            return newState;
        }
        case "REACTION_EDITED": {
            let newData = Object.assign({}, newState.data);

            for(let i = 0; i < newData.Messages[action.data.message].reactions.length; i++)
            {
                let r = newData.Messages[action.data.message].reactions[i];
                if(r.emoji === action.data.oldEmoji)
                {
                    r.emoji = action.data.newEmoji;
                    r.role = action.data.newRole;
                    break;
                }
            }

            newState.data = newData;
            return newState;
        }
        case "REACTION_DELETED": {

            let newData = Object.assign({}, newState.data);
            let newMessage = Object.assign({}, newData.Messages[action.data.message]);

            for(let i = 0; i < newMessage.reactions.length; i++)
            {
                if(newMessage.reactions[i].emoji === action.data.emoji)
                {
                    newMessage.reactions.splice(i, 1);
                    break;
                }
            }

            newState.data = newData;
            return newState;
        }
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