import React from "react";
import { connect } from "react-redux";
import { clearAlert } from "../actions/alert";
const Alert = props => (
  <div className="container error-container">
    <div className="error-container__title">{props.errorTitle}</div>
    <div className="error-container__message">{props.errorMessage}</div>
    <div
      className="login--btn bkm__btn error-container__btn"
      onClick={() => props.dispatch(clearAlert())}
    >
      Ok
    </div>
  </div>
);

const mapStateToProps = state => ({
  errorTitle: state.alert.title,
  errorMessage: state.alert.message
});

export default connect(mapStateToProps)(Alert);
