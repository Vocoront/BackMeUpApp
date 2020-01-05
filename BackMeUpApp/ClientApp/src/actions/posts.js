export const setPosts = (posts = []) => ({
  type: "SET_POSTS",
  posts
});

export const addPosts = (posts = []) => ({
  type: "SET_POSTS_NEXTPAGE",
  posts
});

export const incrementPage = () => ({
  type: "INCREMENT_PAGE"
});

export const setPostOpinion = (postId = "", opinion = "agree") => ({
  type: "SET_POST_OPINION",
  postId,
  opinion
});

export const setPostFollow = (postId = "", follow = false) => ({
  type: "SET_POST_FOLLOW",
  postId,
  follow
});

export const resetPosts = () => ({
  type: "RESET_POSTS"
});

export const setLoading = (loading = false) => ({
  type: "SET_LOADING",
  loading
});

export const setBackHistory = (value = false) => ({
  type: "SET_BACK_HISTORY",
  value
});
