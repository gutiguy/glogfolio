import React, { Component } from "react";
import withLoading from "../../../hoc/withLoading";
import ABlogForm from "./ABlogForm";
import AToolbar from "../AToolbar";

import {
  FETCH_POSTS,
  ADD_POST,
  DELETE_POST,
  ADD_TAG,
  EDIT_TAGS,
  DELETE_TAGS
} from "../../../graphql/posts";

import { graphql, compose } from "react-apollo";
import { makeUpdateMap } from "../../../graphql/utils";

// import {
//   syncDelete,
//   syncAdd,
//   syncEdit,
//   syncReorder
// } from "./navigationMutationSyncs";

export default class ABlog extends Component {
  render() {
    return (
      <div>
        <AToolbar />
      </div>
    );
  }
}
