import authHeader from "../helpers/authHeader";
import store from "../store/configureStore";
import { setPosts, addPosts, resetPosts } from "../actions/posts";
const getPosts = (nextPage = false) => {
  if (!nextPage) {
    store.dispatch(resetPosts());
  }
  const state = store.getState();
  const authToken = authHeader();
  const formData = new FormData();
  formData.append("filter", state.filter.filter);
  formData.append("order", state.filter.order);
  formData.append("page", state.posts.page);
  formData.append("limit", state.posts.limit);
  fetch("api/post", {
    method: "POST",
    headers: {
      ...authToken
    },
    body: formData
  })
    .then(res => {
      if (res.status === 200) return res.json();
      throw new Error("Failed to obtain posts");
    })
    .then(data => {
      if (nextPage) store.dispatch(addPosts(data));
      else store.dispatch(setPosts(data));
    })
    .catch(er => console.log(er));
};

export { getPosts };
