import React from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { convertUtcToLocal } from "../helpers/convertUtcToLocal";

const NortificationContainer = props => {
  return (
    <div className="notification-container">
      <div className="notification-container_header">Topics</div>
      {props.notifications.map((notification, index) => (
        <Route
          key={index}
          render={({ history }) => (
            <div className="notification-container__message">
              <div
                onClick={() =>
                  history.push("/extendedPost/" + notification.postId)
                }
              >
                <div className="notification-container__created-at">
                  {" "}
                  {convertUtcToLocal(notification.createdAt)}
                </div>
                <div> {notification.creator}</div>

                <div className="notification-container__route">
                  {notification.message}
                </div>
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
