import React from 'react';
import {connect} from 'react-redux';
import {setUsername,setPassword} from '../actions/user';
const LogIn=(props)=>{

    return (
        <div className='login'>
            Username <input type='text' onChange={(e)=>{
                    props.dispatch(setUsername(e.target.value));
            }} placeholder="Enter username"/>
            Password <input type='password' onChange={(e)=>{
                    props.dispatch(setPassword(e.target.value));
            }}
            
            placeholder="Enter password"/>
            <div className="login--btn" onClick={()=>props.submitLogIn()} >Log In</div>
        </div>
    )
}

const mapStateToProps=(state)=>({
    user:state.user
});

export default connect(mapStateToProps)(LogIn);