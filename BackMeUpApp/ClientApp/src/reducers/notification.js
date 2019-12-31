const defaultState = {
  connection: undefined,
  notifiactions: [],
  follows: [],
  connectionId: undefined
};

const notificationReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "SET_CONNECTION":
      return { ...state, connection: action.connection };
    case "SET_FOLLOWS":
      return { ...state, follows: action.follows };
    case "SET_CONNECTION_ID": {
      return { ...state, connectionId: action.connectionId };
    }
    case "ADD_NOTIFICATON": {
      return {
        ...state,
        notifiactions: [action.message, ...state.notifiactions]
      };
    }
    case "DELETE_CONNECTION": {
      state.connection.stop();
      return defaultState;
    }
    default:
      return state;
  }
};

export default notificationReducer;
