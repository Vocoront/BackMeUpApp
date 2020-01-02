import React, { Component } from "react";
import { connect } from "react-redux";
import { setFilter, setOrder, setPeriod } from "../actions/filter";
import { getPosts } from "../services/postObtaining";
class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="filter">
        <div className="filter__filter">
          <select
            value={this.props.filter.filter}
            onChange={e => {
              this.props.dispatch(setFilter(e.target.value));
            }}
          >
            <option value="date">Date</option>
            <option value="likes">Likes</option>
          </select>
        </div>
        <div className="filter__order">
          <select
            value={this.props.filter.order}
            onChange={e => {
              this.props.dispatch(setOrder(e.target.value));
            }}
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
        <div className="filter__period">
          <select
            value={this.props.filter.period}
            onChange={e => {
              this.props.dispatch(setPeriod(e.target.value));
            }}
          >
            <option value="day">Today</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="all">All</option>
          </select>
        </div>
        <div className="fillter__button">
          <button
            onClick={() => {
              getPosts(false);
            }}
          >
            Filter
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  filter: state.filter
});

export default connect(mapStateToProps)(Filter);
