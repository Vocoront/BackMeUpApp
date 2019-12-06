const defaulState={
    username: "",
    token: localStorage.getItem("token")
}

const userReducer=(state=defaulState,action)=>{
    switch (action.type){
        case  "SET_TOKEN":localStorage.setItem("token",action.token); return {...state,token:action.token};
        case  "DELETE_TOKEN":localStorage.removeItem("token"); return {...state,token:localStorage.getItem("token")};
        case  "SET_USERNAME": return {...state,username:action.username};
        default: return state;
    }
}

export default userReducer;