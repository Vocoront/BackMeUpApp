const defaultState = {
  connection: undefined,
  returnedMessage: [],
  subsribtionIds: []
};

const notificationReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "SET_CONNECTION":
      return { ...state, connection: action.connection };
    case "SET_SUBSCRIPTIONS":
      return { ...state, subsribtionIds: action.data };
    default:
      return state;
  }
};

export default notificationReducer;
