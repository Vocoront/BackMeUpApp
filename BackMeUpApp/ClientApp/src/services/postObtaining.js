import authHeader from "../helpers/authHeader";
import store from "../store/configureStore";
import { setPosts, addPosts } from "../actions/posts";

const getPosts = () => {
  const state = store.getState();
  const authToken = authHeader();
  const formData = new FormData();
  formData.append("filter", state.filter.filter);
  formData.append("order", state.filter.order);
  formData.append("page", state.posts.page);
  formData.append("limit", state.posts.limit);
  fetch("api/post/getposts", {
    method: "POST",
    headers: {
      ...authToken
    },
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      store.dispatch(addPosts(data));
    })
    .catch(er => console.log(er));
};

export { getPosts };
