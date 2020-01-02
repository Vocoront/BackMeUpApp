const defaulState = {
  filter: "date",
  order: "desc",
  period: "day",
  tag: "",
  creator: ""
};

const filterReducer = (state = defaulState, action) => {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, filter: action.filter };
    case "SET_ORDER":
      return { ...state, order: action.order };
    case "SET_PERIOD":
      return { ...state, period: action.period };
    case "SET_TAG":
      return { ...state, tag: action.tag };
    case "SET_CREATOR":
      return { ...state, creator: action.creator };
    default:
      return state;
  }
};

export default filterReducer;
