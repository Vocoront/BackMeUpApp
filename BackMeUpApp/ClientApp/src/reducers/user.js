const defaulState={
    username: "username",
    email: "email"
}

const userReducer=(state=defaulState,action)=>{
    switch (action.type){
        case  "SET_USERNAME": return {...state,username:action.username};
        case  "SET_PASSWORD": return {...state,password:action.password};
        default: return state;
    }
}

export default userReducer;