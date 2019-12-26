import React from "react";
import { connect } from "react-redux";
import { setTag } from "../actions/tag";

const Tag = props => (
  <div className="tag" onClick={() => props.dispatch(setTag(props.Title))}>
    {props.Title}
  </div>
);

// class Tag extends Comment {
//   constructor(props) {
//     super(props);
//     this.state = {
//       tag: ""
//     };
//   }
//   render() {
//     <div className="tag"
//     onClick={()=>{
//         console.log(this.tag);
//     }}>{props.Title}</div>;
//   }
// }

const mapStateToProps = state => ({ tag: state.tag });
export default connect(mapStateToProps)(Tag);
