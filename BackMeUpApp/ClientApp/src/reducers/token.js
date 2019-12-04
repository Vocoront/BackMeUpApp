const defaulState={
    token: localStorage.getItem("token")
}

const tokenReducer=(state=defaulState,action)=>{
    switch (action.type){
        case  "SET_TOKEN":{localStorage.setItem("token",action.token); return {token:action.token}};
        case  "DELETE_TOKEN":{localStorage.removeItem("token"); return {token:localStorage.getItem("token")};};
        default: return state;
    }
}

export default tokenReducer;