import React from "react";
import { connect } from "react-redux";
const NortificationContainer = props => {
  return (
    <div className="notification-container">
      {props.notifications === 0 && <div>No notifications</div>}
      {props.notifications.map((notification, index) => (
        <div className="notification-container__message" key={index}>
          {notification.creator}
          {notification.message}
        </div>
      ))}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    notifications: state.notification.notifiactions
  };
};

export default connect(mapStateToProps)(NortificationContainer);
