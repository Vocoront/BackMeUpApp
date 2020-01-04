export const setPost = (post = {}) => ({
  type: "SET_POST",
  post
});

export const setPostComments = (comments = []) => ({
  type: "SET_POST_COMMENTS",
  comments
});

export const setExtendedLoading = (loading = false) => ({
  type: "SET_EXTENED_POST_LOADING",
  loading
});

export const setCommentLoading = (loading = false) => ({
  type: "SET_COMMENT_LOADING",
  loading
});

export const resetExtendedPost = () => ({
  type: "RESET_EXTENDED_POST"
});
