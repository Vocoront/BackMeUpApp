const defaulState = {
  username: "",
  token: sessionStorage.getItem("token"),
  posts: []
};

const userReducer = (state = defaulState, action) => {
  switch (action.type) {
    case "SET_TOKEN":
      sessionStorage.setItem("token", action.token);
      return { ...state, token: action.token };
    case "DELETE_TOKEN":
      sessionStorage.removeItem("token");
      // sessionStorage.removeItem("username", action.username);
      return {
        ...state,
        token: sessionStorage.getItem("token"),
        username: sessionStorage.getItem("username")
      };
    case "SET_POSTS":
      return { ...state, posts: action.posts };
    case "SET_USERNAME":
      //sessionStorage.setItem("username", action.username);
      return { ...state, username: action.username };
    default:
      return state;
  }
};

export default userReducer;
