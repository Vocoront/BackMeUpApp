const defaulState = {
  visible: false,
  title: "alert title",
  message: "alert message"
};

const alertReducer = (state = defaulState, action) => {
  switch (action.type) {
    case "SET_ALERT":
      return {
        visible: action.visible,
        title: action.title,
        message: action.message
      };
    case "CLEAR_ALERT":
      return {
        defaulState
      };
    default:
      return state;
  }
};

export default alertReducer;
