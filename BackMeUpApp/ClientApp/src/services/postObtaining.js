import authHeader from "../helpers/authHeader";
import store from "../store/configureStore";
import { setPosts, addPosts, resetPosts, setLoading } from "../actions/posts";
import {
  setPost,
  setExtendedLoading,
  setPostComments,
  setCommentLoading
} from "../actions/extendedPost";
const getPostsCreatedBy = nextPage => {
  const state = store.getState();
  const authToken = authHeader();
  const formData = new FormData();
  formData.append("filter", state.filter.filter);
  formData.append("order", state.filter.order);
  formData.append("period", state.filter.period);
  formData.append("page", state.posts.page);
  formData.append("limit", state.posts.limit);

  fetch(
    process.env.REACT_APP_SERVER_DOMAIN +
      "api/post/createdby/" +
      state.filter.creator,
    {
      method: "POST",
      headers: {
        ...authToken
      },
      body: formData
    }
  )
    .then(res => {
      if (res.status === 200) return res.json();
      store.dispatch(setLoading(false));
      throw new Error("Failed to obtain posts");
    })
    .then(data => {
      if (nextPage) store.dispatch(addPosts(data));
      else store.dispatch(setPosts(data));
      store.dispatch(setLoading(false));
    })
    .catch(er => {
      console.log(er);
    });
};

const getPostsWithTag = nextPage => {
  const state = store.getState();
  const authToken = authHeader();
  const formData = new FormData();
  formData.append("filter", state.filter.filter);
  formData.append("order", state.filter.order);
  formData.append("period", state.filter.period);
  formData.append("page", state.posts.page);
  formData.append("limit", state.posts.limit);

  fetch(
    process.env.REACT_APP_SERVER_DOMAIN + "api/post/tag/" + state.filter.tag,
    {
      method: "POST",
      headers: {
        ...authToken
      },
      body: formData
    }
  )
    .then(res => {
      if (res.status === 200) return res.json();
      store.dispatch(setLoading(false));
      throw new Error("Failed to obtain posts");
    })
    .then(data => {
      if (nextPage) store.dispatch(addPosts(data));
      else store.dispatch(setPosts(data));
      store.dispatch(setLoading(false));
    })
    .catch(er => {
      console.log(er);
    });
};

const getAllPosts = nextPage => {
  const state = store.getState();
  const authToken = authHeader();
  const formData = new FormData();
  formData.append("filter", state.filter.filter);
  formData.append("order", state.filter.order);
  formData.append("period", state.filter.period);
  formData.append("page", state.posts.page);
  formData.append("limit", state.posts.limit);
  fetch(process.env.REACT_APP_SERVER_DOMAIN + "api/post", {
    method: "POST",
    headers: {
      ...authToken
    },
    body: formData
  })
    .then(res => {
      if (res.status === 200) return res.json();
      store.dispatch(setLoading(false));
      throw new Error("Failed to obtain posts");
    })
    .then(data => {
      if (nextPage) store.dispatch(addPosts(data));
      else store.dispatch(setPosts(data));
      store.dispatch(setLoading(false));
    })
    .catch(er => {
      console.log(er);
    });
};
const getPosts = (nextPage = false) => {
  if (!nextPage) {
    store.dispatch(resetPosts());
  }
  const state = store.getState();

  store.dispatch(setLoading(true));
  if (state.filter.creator !== "") getPostsCreatedBy(nextPage);
  else {
    if (state.filter.tag !== "") getPostsWithTag(nextPage);
    else getAllPosts(nextPage);
  }
};

const getPostById = (id = undefined) => {
  if (!id) return;
  store.dispatch(setExtendedLoading(true));
  fetch(process.env.REACT_APP_SERVER_DOMAIN + "api/post/" + id, {
    method: "GET"
  })
    .then(res => {
      if (res.status === 200) return res.json();
      store.dispatch(setLoading(false));
      throw new Error("Failed to obtain post");
    })
    .then(data => {
      store.dispatch(setPost(data));
      store.dispatch(setExtendedLoading(false));
    })
    .catch(er => {
      store.dispatch(setExtendedLoading(false));
      console.log(er);
    });
};

const getCommentsForPost = (id = undefined) => {
  if (!id) return;
  let putanja = process.env.REACT_APP_SERVER_DOMAIN + "api/post/comments/" + id;
  store.dispatch(setCommentLoading(true));
  fetch(putanja, { method: "GET" })
    .then(res => res.json())
    .then(data => {
      store.dispatch(setPostComments(data));
      store.dispatch(setCommentLoading(false));
    })
    .catch(er => console.log(er));
};

export { getPosts, getPostById, getCommentsForPost };
