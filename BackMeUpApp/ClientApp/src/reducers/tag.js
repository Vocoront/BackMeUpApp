const defaulState = {
  tag: ""
};

const tagReducer = (state = defaulState, action) => {
  switch (action.type) {
    case "SET_TAG":
      return { ...state, username: action.tag };
    default:
      return state;
  }
};

export default tagReducer;
