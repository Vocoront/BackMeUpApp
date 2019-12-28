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

const setPostFollow = (postId, follow, state) => {
  let newPostArray = state.posts.map(post => {
    if (post.id === postId) return { ...post, follow };
    else return post;
  });
  return { ...state, posts: newPostArray };
};

const addNextPage = (newposts, state) => {
  let newPosts = state.posts.concat(newposts);
  console.log(newPosts);

  return { ...state, posts: newPosts };
};

const postsReducer = (state = defaulState, action) => {
  switch (action.type) {
    case "SET_POSTS":
      return { ...state, posts: action.posts };
    case "SET_POST_OPINION":
      return setPostOpinion(action.postId, action.opinion, state);
    case "SET_POST_FOLLOW":
      return setPostFollow(action.postId, action.follow, state);
    case "SET_POSTS_NEXTPAGE":
      return addNextPage(action.posts, state);
    default:
      return state;
  }
};

export default postsReducer;
