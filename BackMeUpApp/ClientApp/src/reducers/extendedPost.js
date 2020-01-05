const defaulState = {
  post: {},
  loading: true,
  commentsLoading: true,
  comments: []
};

const extendedPostReducer = (state = defaulState, action) => {
  switch (action.type) {
    case "SET_POST":
      return { ...state, post: action.post };
    case "SET_POST_COMMENTS":
      return { ...state, comments: action.comments };
    case "SET_EXTENED_POST_LOADING":
      return { ...state, loading: action.loading };
    case "SET_COMMENT_LOADING":
      return { ...state, commentsLoading: action.loading };
    case "SET_EXT_FOLLOW":
      return { ...state, post: { ...state.post, follow: action.follow } };
    case "SET_EXT_POST_OPINION": {
      if (action.choice === "agree") {
        state.post.agreeNo++;
        if (state.post.choice === "disagree") state.post.disagreeNo--;
      } else {
        if (state.post.choice === "agree") state.post.agreeNo--;
        state.post.disagreeNo++;
      }
      return { ...state, post: { ...state.post, choice: action.choice } };
    }

    case "RESET_EXTENDED_POST":
      return defaulState;
    default:
      return state;
  }
};

export default extendedPostReducer;
