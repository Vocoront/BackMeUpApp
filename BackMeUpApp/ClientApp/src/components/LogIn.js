import React from 'react';

const LogIn=(props)=>{

    return (
        <div className='login'>
            Username <input type='text' placeholder="Enter username"/>
            Password <input type='password' placeholder="Enter password"/>
            <div className="login--btn" onClick={()=>props.submitLogIn()} >Log In</div>
        </div>
    )
}

export default LogIn;