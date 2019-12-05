const defaulState={
    username: "username"
}

const userReducer=(state=defaulState,action)=>{
    switch (action.type){
        case  "SET_USERNAME": return {...state,username:action.username};
        default: return state;
    }
}

export default userReducer;