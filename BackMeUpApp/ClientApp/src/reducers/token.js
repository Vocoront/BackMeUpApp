const defaulState={
    token: ''
}

const tokenReducer=(state=defaulState,action)=>{
    switch (action.type){
        case  "SET_TOKEN":return {token:action.token};
        case  "DELETE_TOKEN": return {token:''};
        default: return state;
    }
}

export default tokenReducer;