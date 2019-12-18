export const setPosts=(posts=[])=>({
    type: "SET_POSTS",
    posts
});


export const setPostOpinion=(postId='',opinion='agree')=>({
    type:"SET_POST_OPINION",
    postId,
    opinion
})