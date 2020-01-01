const defaulState = {
  filter: "date",
  order: "desc"
};

const filterReducer = (state = defaulState, action) => {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, filter: action.filter };
    case "SET_ORDER":
      return { ...state, order: action.order };
    default:
      return state;
  }
};

export default filterReducer;
