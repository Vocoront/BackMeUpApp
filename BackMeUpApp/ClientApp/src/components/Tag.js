import React from "react";
import { connect } from "react-redux";
import { setTag } from "../actions/filter";

const Tag = props => (
  <div className="tag" onClick={() => props.dispatch(setTag(props.Title))}>
    {props.Title}
  </div>
);


const mapStateToProps = state => ({ tag: state.tag });
export default connect(mapStateToProps)(Tag);
