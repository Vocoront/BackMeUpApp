import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { convertUtcToLocal } from "../helpers/convertUtcToLocal";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import { AwesomeButton } from "react-awesome-button";

// class Header extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       tagFilter: ""
//     };
//   }
class NortificationContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagFilter: "",
      open: false
    };
  }

  render() {
    return (
      <div className="notificaions_all">
        {!this.state.open ? (
          <AwesomeButton
            className="aws-btn"
            size="extrasmall"
            type="secondary"
            ripple={true}
            onPress={() => this.setState({ open: !this.state.open })}
            //aria-controls="example-collapse-text"
            //aria-expanded={this.state.open}
            //variant="info"
          >
            <i class="far fa-envelope"></i>
          </AwesomeButton>
        ) : (
          <Collapse in={this.state.open}>
            <div className="notification-container">
              <Button
                variant="outline-danger"
                onClick={() => this.setState({ open: !this.state.open })}
              >
                <i class="fas fa-times"></i>
              </Button>
              <div>
                {this.props.notifications === 0 && <div>No notifications</div>}
                {this.props.notifications.map((notification, index) => (
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
            </div>
          </Collapse>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    notifications: state.notification.notifiactions
  };
};
export default connect(mapStateToProps)(NortificationContainer);
