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
          <div
            onClick={() => {
              if (this.props.filter.filter === "date") return;
              this.props.dispatch(setFilter("date"));
              getPosts(false);
            }}
            className={
              (this.props.filter.filter === "date" &&
                "filter__filter__option filter__filter__option--selected") ||
              "filter__filter__option"
            }
          >
            Date
          </div>
          <div
            onClick={() => {
              if (this.props.filter.filter === "likes") return;
              this.props.dispatch(setFilter("likes"));
              getPosts(false);
            }}
            className={
              (this.props.filter.filter === "likes" &&
                "filter__filter__option filter__filter__option--selected") ||
              "filter__filter__option"
            }
          >
            Likes
          </div>
        </div>
        <div className="filter__filter">
          <div
            onClick={() => {
              if (this.props.filter.order === "desc") return;
              this.props.dispatch(setOrder("desc"));
              getPosts(false);
            }}
            className={
              (this.props.filter.order === "desc" &&
                "filter__filter__option filter__filter__option--selected") ||
              "filter__filter__option"
            }
          >
            {this.props.filter.filter === "date" ? "New" : "Most"}
          </div>
          <div
            onClick={() => {
              if (this.props.filter.order === "asc") return;
              this.props.dispatch(setOrder("asc"));
              getPosts(false);
            }}
            className={
              (this.props.filter.order === "asc" &&
                "filter__filter__option filter__filter__option--selected") ||
              "filter__filter__option"
            }
          >
            {this.props.filter.filter === "date" ? "Old" : "Least"}
          </div>
        </div>

        <div className="filter__filter-period">
          <div
            onClick={() => {
              if (this.props.filter.period === "day") return;
              this.props.dispatch(setPeriod("day"));
              getPosts(false);
            }}
            className={
              (this.props.filter.period === "day" &&
                "filter__filter__option filter__filter__option--selected") ||
              "filter__filter__option"
            }
          >
            Today
          </div>
          <div
            onClick={() => {
              if (this.props.filter.period === "week") return;
              this.props.dispatch(setPeriod("week"));
              getPosts(false);
            }}
            className={
              (this.props.filter.period === "week" &&
                "filter__filter__option filter__filter__option--selected") ||
              "filter__filter__option"
            }
          >
            Week
          </div>
          <div
            onClick={() => {
              if (this.props.filter.period === "month") return;
              this.props.dispatch(setPeriod("month"));
              getPosts(false);
            }}
            className={
              (this.props.filter.period === "month" &&
                "filter__filter__option filter__filter__option--selected") ||
              "filter__filter__option"
            }
          >
            Month
          </div>
          <div
            onClick={() => {
              if (this.props.filter.period === "all") return;
              this.props.dispatch(setPeriod("all"));
              getPosts(false);
            }}
            className={
              (this.props.filter.period === "all" &&
                "filter__filter__option filter__filter__option--selected") ||
              "filter__filter__option"
            }
          >
            All
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  filter: state.filter
});

export default connect(mapStateToProps)(Filter);
