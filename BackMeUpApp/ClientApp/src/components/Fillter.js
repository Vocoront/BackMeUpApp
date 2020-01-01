import React, { Component } from "react";
import { connect } from "react-redux";
import { setFilter, setOrder } from "../actions/filter";
import {getPosts} from '../services/postObtaining';
class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="filter">
        <button onClick={() => {this.props.dispatch(setFilter('date'))}}>Date</button>
        <button onClick={() => {this.props.dispatch(setFilter('likes'))}}>Likes</button>
        <button onClick={() => {this.props.dispatch(setOrder('asc'))}}>ASC</button>
        <button onClick={() => {this.props.dispatch(setOrder("desc"))}}>DESC</button>
        <button onClick={()=>{getPosts()}}>Filter</button>
      </div>
    );
  }
}

export default connect()(Filter);
