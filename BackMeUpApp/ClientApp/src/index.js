import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import '../node_modules/font-awesome/css/font-awesome.min.css'; 
import "normalize.css/normalize.css"; //koristi se da normalizuje css na razlicitim browser-ima
import "./styles/styles.scss";

import AppRouter from "./routers/AppRouter";
import configureStore from "./store/configureStore";

const store = configureStore();

const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

ReactDOM.render(jsx, document.getElementById("root"));
