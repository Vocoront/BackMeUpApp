import { follow } from "../services/postModification";

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

export const setFollow = (follow = true) => ({
  type: "SET_EXT_FOLLOW",
  follow
});

export const setExtPostOpinion = (choice = "agree") => ({
  type: "SET_EXT_POST_OPINION",
  choice
});
