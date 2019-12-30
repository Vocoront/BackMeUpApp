import React from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { convertUtcToLocal } from "../helpers/convertUtcToLocal";
const NortificationContainer = props => {
  return (
    <div className="notification-container">
      {props.notifications === 0 && <div>No notifications</div>}
      {props.notifications.map((notification, index) => (
        <Route
          key={index}
          render={({ history }) => (
            <div className="notification-container__message">
              <div>
                {convertUtcToLocal(notification.createdAt)}:
                {notification.creator}:{notification.message}
              </div>
              <div
                className="notification-container__post-id"
                onClick={() =>
                  history.push("/extendedPost/" + notification.postId)
                }
              >
                post
              </div>
            </div>
          )}
        />
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
