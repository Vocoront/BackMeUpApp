const defaulState = {
  posts: []
};

const setPostOpinion = (postId, choice, state) => {
  let newPostArray = state.posts.map(post => {
    if (post.id === postId) return { ...post, choice };
    else return post;
  });
  return { ...state, posts: newPostArray };
};

const postsReducer = (state = defaulState, action) => {
  switch (action.type) {
    case "SET_POSTS":
      return { ...state, posts: action.posts };
    case "SET_POST_OPINION":
      return setPostOpinion(action.postId, action.opinion, state);

    default:
      return state;
  }
};

export default postsReducer;
