import store from "../store/configureStore";
import authHeader from "../helpers/authHeader";
import { setPostFollow } from "../actions/posts";

const follow = (postId = null) => {
  if (postId === null) return;
  const bearer = authHeader();
  fetch("api/user/follow/" + postId, {
    method: "POST",
    headers: {
      ...bearer
    }
  }).then(
    res => res.status === 200 && store.dispatch(setPostFollow(postId, true))
  );
};

const unfollow = (postId = null) => {
  if (postId === null) return;
  const bearer = authHeader();
  fetch("api/user/unfollow/" + postId, {
    method: "POST",
    headers: {
      ...bearer
    }
  }).then(
    res => res.status === 200 && store.dispatch(setPostFollow(postId, false))
  );
};

export { follow, unfollow };
