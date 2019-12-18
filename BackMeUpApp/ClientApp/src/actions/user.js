export const setUsername=(username='')=>({
    type: "SET_USERNAME",
    username
});
export const setPosts=(posts=[])=>({
    type: "SET_POSTS",
    posts
});

export const setToken=(token='')=>({
    type: "SET_TOKEN",
    token
});

export const deleteToken=()=>({
    type: "DELETE_TOKEN"
});