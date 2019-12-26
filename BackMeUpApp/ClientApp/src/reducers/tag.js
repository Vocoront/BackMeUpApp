const defaulState = {
  tag: ""
};

const newTag = (tag, state) => {
  let newT = "to";
  return { ...state, tag: newT };
};

const tagReducer = (state = defaulState, action) => {
  switch (action.type) {
    case "SET_TAG": {
      console.log(action.tag);
      return { ...state, tag: action.tag };
    }
    case "SET_FILTER": {
      console.log("filter je:" + action.filter);
      return { state, filter: action.filter }; //0 1 2
    }
    default:
      return state;
  }
};

export default tagReducer;
