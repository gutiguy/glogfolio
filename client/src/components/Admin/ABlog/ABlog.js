import React, { Component } from "react";
import APosts from "./APosts";
import BlogSideBar from "./BlogSideBar";
import { Grid } from "@material-ui/core";

import AToolbar from "../AToolbar";
import APostForm from "./APostForm";
import {
  FETCH_POSTS_SHALLOW,
  FETCH_POST_DEEP,
  ADD_POST,
  DELETE_POST,
  EDIT_POST
} from "../../../graphql/blog";
import { syncAdd, syncDelete } from "./blogMutationSyncs";
import withLoading from "../../../hoc/withLoading";
import { graphql, compose } from "react-apollo";
import { makeUpdateMap, stripTypenames } from "../../../graphql/utils";
import ATagsInput from "./ATagsInput";

const APostEditForm = compose(
  graphql(FETCH_POST_DEEP, {
    name: "editedPost",
    options: ({ id }) => ({
      variables: {
        ids: [id]
      }
    }),
    props: ({ editedPost, editedPost: { loading } }) => ({
      editedPost,
      isLoading: loading
    })
  }),
  withLoading
)(APostForm);

class ABlog extends Component {
  state = {
    addForm: false,
    currentlyEditing: null,
    selectedTags: null,
    month: null,
    year: null
  };

  addTag = id => {
    const { selectedTags } = this.state;
    let mutatedTags = [...selectedTags];
    mutatedTags.push(id);
    this.setState({ selectedTags: mutatedTags });
  };

  submitAdd = input => {
    this.props.addPost({ addedPost: input });
    this.setState({ addForm: false });
  };

  submitDelete = id => {
    this.props.deletePost({ id });
  };

  submitEdit = async input => {
    const { id, tags, ...editedPost } = input;
    const res = await this.props.editPost({
      variables: {
        id,
        editedPost: {
          ...stripTypenames(editedPost),
          tags: tags.map(tag => tag.id)
        }
      }
    });
    console.log("res", res);
  };

  render() {
    const { addForm, currentlyEditing, selectedTags, month, year } = this.state;
    const { posts } = this.props;
    if (addForm) {
      return (
        <APostForm
          title="Add Post"
          onSubmit={this.submitAdd}
          onClose={() => this.setState({ addForm: false })}
        />
      );
    }
    if (currentlyEditing) {
      return (
        <APostEditForm
          title="Edit Post"
          onSubmit={this.submitEdit}
          onClose={() => this.setState({ currentlyEditing: null })}
          initialValues={currentlyEditing}
          id={currentlyEditing.id}
        />
      );
    }
    return (
      <div>
        <AToolbar
          onDelete={this.onDelete}
          onAdd={() => this.setState({ addForm: true })}
        >
          <ATagsInput />
        </AToolbar>
        <Grid container spacing={24}>
          <Grid item xs={8}>
            <APosts
              selectedTags={selectedTags}
              posts={posts}
              month={month}
              year={year}
              onDelete={this.submitDelete}
              onEdit={currentlyEditing => this.setState({ currentlyEditing })}
            />
          </Grid>
          <Grid item xs={4}>
            <BlogSideBar />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default compose(
  graphql(FETCH_POSTS_SHALLOW, {
    props: ({ data }) => ({
      posts: data.posts,
      isLoading: data.loading
    })
  }),
  graphql(ADD_POST, { props: makeUpdateMap({ name: "addPost", cb: syncAdd }) }),
  graphql(DELETE_POST, {
    props: makeUpdateMap({ name: "deletePost", cb: syncDelete })
  }),
  graphql(EDIT_POST, { name: "editPost" }),
  withLoading
)(ABlog);
