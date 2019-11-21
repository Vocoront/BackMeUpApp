import React from 'react';
import {NavLink} from 'react-router-dom';
const Header=()=>(
    <header>
      Back Me Up
    
      <NavLink exact={true} activeClassName="is-active" to="/">Home</NavLink>
      <NavLink activeClassName="is-active" to="/profile">Profile</NavLink>
    </header>
  )

  export default Header;