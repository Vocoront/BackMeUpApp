import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import "normalize.css/normalize.css"; //koristi se da normalizuje css na razlicitim browser-ima
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/styles.scss";
import '../node_modules/font-awesome/css/font-awesome.css'; 

import AppRouter from "./routers/AppRouter";
import configureStore from "./store/configureStore";

const store = configureStore();

const jsx = (
  <>
  <Provider store={store}>
    <AppRouter />
    
  </Provider>


<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" type="text/css"/>
</>
);

ReactDOM.render(jsx, document.getElementById("root"));
