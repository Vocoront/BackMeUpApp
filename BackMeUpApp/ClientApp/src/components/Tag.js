import React from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { setTag } from "../actions/filter";

const Tag = props => (
  <Route
    render={({ history }) => (
      <div
        className="tag"
        onClick={() => {
          props.dispatch(setTag(props.Title));
          history.push("/post/tag/" + props.Title);
        }}
      >
        {props.Title}
      </div>
    )}
  />
);

const mapStateToProps = state => ({ tag: state.tag });
export default connect(mapStateToProps)(Tag);
