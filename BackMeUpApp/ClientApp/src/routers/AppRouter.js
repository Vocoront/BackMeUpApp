import React from 'react';
import {BrowserRouter, Route,Switch} from 'react-router-dom';
import HomePage from '../components/HomePage';
import ProfilePage from "../components/ProfilePage";
import NotFoundPage from '../components/error-page/NotFoundPage';
import Header from '../components/Header';
import LogInPage from "../components/login-page/LogInPage";
import CreatePostPage from "../components/CreatePostPage"
const AppRouter=(props)=> {
  return (
    <BrowserRouter>
    <div>
      <Header/>
      <Switch>
        <Route exact={true} path="/" component={HomePage}/>
        <Route  path="/createpost" component={CreatePostPage}/>
        <Route  path="/post/:username" component={ProfilePage}/>
        <Route path="/login" component={LogInPage}/>
        <Route component={NotFoundPage}/>
   </Switch>
    </div>
 
    </BrowserRouter>
  );
}

export default AppRouter;
