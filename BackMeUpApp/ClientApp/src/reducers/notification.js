const defaultState = {
  connection: undefined,
  returnedMessage: [],
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
    default:
      return state;
  }
};

export default notificationReducer;
