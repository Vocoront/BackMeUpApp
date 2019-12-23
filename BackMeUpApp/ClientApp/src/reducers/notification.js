const defaultState={
    connection: undefined,
    returnedMessage: [],
    subsribtionIds: []
}

const notificationReducer=(state=defaultState,action)=>{
    switch (action.type) {
        case "SET_CONNECTION":
          return { ...state, connection: action.connection };
        default:
          return state;
      }
}

export default notificationReducer;