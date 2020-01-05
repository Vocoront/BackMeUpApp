import { isAfter } from "../helpers/convertUtcToLocal";

const defaultState = {
  connection: undefined,
  notifiactions: [],
  follows: [],
  connectionId: undefined
};

const sortNotificationsByDate = notifications => {
  return notifications.sort((a, b) => {
    if (isAfter(a.createdAt, b.createdAt)) {
      return -1;
    }
    if (isAfter(b.createdAt, a.createdAt)) {
      return 1;
    }
    return 0;
  });
};

const notificationReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "SET_CONNECTION":
      return { ...state, connection: action.connection };
    case "SET_FOLLOWS":
      return { ...state, follows: action.follows };
    case "ADD_NEW_FOLLOW":
      return { ...state, follows: state.follows.concat(action.follow) };
    case "REMOVE_FOLLOW":
      return {
        ...state,
        follows: state.follows.filter(f => f != action.follow)
      };
    case "SET_CONNECTION_ID": {
      return { ...state, connectionId: action.connectionId };
    }
    case "ADD_NOTIFICATON": {
      return {
        ...state,
        notifiactions: sortNotificationsByDate([
          action.message,
          ...state.notifiactions
        ])
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
