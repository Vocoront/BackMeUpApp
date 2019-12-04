import React from "react";

const ErrorContainer = props => (
  <div className="container error-container">
    <div className="error-container__title">{props.errorTitle}</div>
    <div className="error-container__message">{props.errorMessage}</div>
    <div className="login--btn bkm__btn error-container__btn" onClick={()=>props.onOk()}>Ok</div>
  </div>
);

export default ErrorContainer;
