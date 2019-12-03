import React from 'react';
import { NavLink } from 'react-router-dom';
//import StickyParalaxHeader from 'react-native-sticky-parallax-header'
import Navigation from "react-sticky-nav";

const Header = () => (
    
    <Navigation className="header" disabled="open" >
    
      <div className="header__title">Back Me Up</div>
      <div className="header__filler"></div>
      <NavLink className="header__navlink" exact={true} activeClassName="header__navlink--is-active" to="/">Home</NavLink>
      <NavLink className="header__navlink" activeClassName="header__navlink--is-active" to="/profile">Profile</NavLink>
      <NavLink className="header__navlink" activeClassName="header__navlink--is-active" to="/login">Log In</NavLink>
    
    </Navigation>
  )

  export default Header;