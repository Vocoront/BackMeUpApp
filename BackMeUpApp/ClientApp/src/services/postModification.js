import store from "../store/configureStore";
import authHeader from "../helpers/authHeader";
import { setPostFollow, setPostOpinion } from "../actions/posts";
import { setFollow, setExtPostOpinion } from "../actions/extendedPost";
import { removeTopic, addNewTopics } from "../services/notification";
import { getCommentsForPost } from "./postObtaining";
import { setCommentLoading } from "../actions/extendedPost";
const follow = async (postId = null) => {
  if (postId === null) return;
  const state = store.getState();
  const bearer = authHeader();
  await fetch(
    process.env.REACT_APP_SERVER_DOMAIN + "api/user/follow/" + postId,
    {
      method: "POST",
      headers: {
        ...bearer
      }
    }
  ).then(res => {
    if (res.status === 200) {
      store.dispatch(setPostFollow(postId, true));
      if (state.extendedPost.post.id === postId) {
        store.dispatch(setFollow(true));
      }
      addNewTopics([postId]);
    }
  });
};

const unfollow = async (postId = null) => {
  if (postId === null) return;
  const bearer = authHeader();
  const state = store.getState();

  await fetch(
    process.env.REACT_APP_SERVER_DOMAIN + "api/user/unfollow/" + postId,
    {
      method: "POST",
      headers: {
        ...bearer
      }
    }
  ).then(res => {
    if (res.status === 200) {
      store.dispatch(setPostFollow(postId, false));
      if (state.extendedPost.post.id === postId) {
        store.dispatch(setFollow(false));
      }
      removeTopic(postId);
    }
  });
};

const addNewComment = (comment = "", IdPosta = "") => {
  if (comment === "" || IdPosta === "") return;
  const bearer = authHeader();

  const formData = new FormData();
  formData.append("IdPosta", IdPosta);
  formData.append("CommentText", comment);
  store.dispatch(setCommentLoading(true));
  fetch(process.env.REACT_APP_SERVER_DOMAIN + "api/post/make_comment", {
    method: "POST",
    body: formData,
    headers: {
      ...bearer
    }
  })
    .then(res => {
      if (res.status === 200) return res.json();
      throw new Error("Failed to comment!");
    })
    .then(data => {
      getCommentsForPost(IdPosta);
    })
    .catch(er => {
      store.dispatch(setCommentLoading(false));
      console.log(er);
    });
};

const addOpinion = async (postId = "", boolOpinion = false) => {
  if (postId === "") return;
  const bearer = authHeader();

  const formData = new FormData();
  formData.append("idPosta", postId);
  formData.append("opinion", boolOpinion);
  await fetch(process.env.REACT_APP_SERVER_DOMAIN + "api/post/vote", {
    method: "POST",
    body: formData,
    headers: {
      ...bearer
    }
  })
    .then(res => res.json())
    .then(data => {
      store.dispatch(setPostOpinion(postId, data.opinion));
      store.dispatch(setExtPostOpinion(data.opinion));
    })
    .catch(er => console.log(er));
};

export { follow, unfollow, addNewComment, addOpinion };
