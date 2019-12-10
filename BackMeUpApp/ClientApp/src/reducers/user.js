const defaulState={
    username: "",
    token: sessionStorage.getItem("token"),
    posts: []
}

const userReducer=(state=defaulState,action)=>{
    switch (action.type){
        case  "SET_TOKEN":sessionStorage.setItem("token",action.token); return {...state,token:action.token};
        case  "DELETE_TOKEN":sessionStorage.removeItem("token"); return {...state,token:sessionStorage.getItem("token")};
        case 'SET_POSTS':return {...state,posts:action.posts};
        case  "SET_USERNAME": return {...state,username:action.username};
        default: return state;
    }
}

export default userReducer;