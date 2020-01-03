import store from "../store/configureStore";
import authHeader from "../helpers/authHeader";
import { setPostFollow } from "../actions/posts";
import { removeTopic, addNewTopics } from "../services/notification";
const follow = (postId = null) => {
  if (postId === null) return;
  const bearer = authHeader();
  fetch(process.env.REACT_APP_SERVER_DOMAIN + "api/user/follow/" + postId, {
    method: "POST",
    headers: {
      ...bearer
    }
  }).then(res => {
    if (res.status === 200) {
      store.dispatch(setPostFollow(postId, true));
      addNewTopics([postId]);
    }
  });
};

const unfollow = (postId = null) => {
  if (postId === null) return;
  const bearer = authHeader();
  fetch(process.env.REACT_APP_SERVER_DOMAIN + "api/user/unfollow/" + postId, {
    method: "POST",
    headers: {
      ...bearer
    }
  }).then(res => {
    if (res.status === 200) {
      store.dispatch(setPostFollow(postId, false));
      removeTopic(postId);
    }
  });
};

export { follow, unfollow };
