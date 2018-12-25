import React, { Component } from "react";
import APosts from "./APosts";
import BlogSideBar from "./BlogSideBar";
import { Grid } from "@material-ui/core";
import { debounce } from "debounce";
import AToolbar from "../AToolbar";
import APostForm from "./APostForm";
import {
  FETCH_POSTS_SHALLOW,
  FETCH_POST_DEEP,
  ADD_POST,
  DELETE_POST,
  EDIT_POST,
  FETCH_TAGS
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
  constructor(props) {
    super(props);
    this.state = {
      addForm: false,
      currentlyEditing: null,
      selectedTags: [],
      month: null,
      year: null
    };

    this.refetchPosts = debounce(this.refetchPosts, 700);
  }

  refetchPosts = () => {
    console.log(this.state.selectedTags);
    this.props.FetchPostsShallow.refetch({
      tags: this.state.selectedTags
    });
  };

  addTag = async id => {
    const { selectedTags } = this.state;
    let mutatedTags = [...selectedTags];
    mutatedTags.push(id);
    await this.setState({ selectedTags: mutatedTags });
    this.refetchPosts();
  };

  removeTag = async id => {
    await this.setState(prevState => ({
      selectedTags: prevState.selectedTags.filter(tag => tag !== id)
    }));
    this.refetchPosts();
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
    await this.props.editPost({
      variables: {
        id,
        editedPost: {
          ...stripTypenames(editedPost),
          tags: tags.map(tag => tag.id)
        }
      }
    });
    this.setState({ currentlyEditing: null });
  };

  componentDidMount() {
    console.log("mounting");
  }
  render() {
    const { addForm, currentlyEditing, selectedTags, month, year } = this.state;
    let { posts } = this.props.FetchPostsShallow;
    const { tags } = this.props.FetchTags;

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
          <ATagsInput tags={tags} />
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
            <BlogSideBar
              tags={tags}
              selectedTags={selectedTags}
              onAddTag={this.addTag}
              onDeleteTag={this.removeTag}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default compose(
  graphql(FETCH_POSTS_SHALLOW, {
    name: "FetchPostsShallow"
  }),
  graphql(FETCH_TAGS, {
    name: "FetchTags"
  }),
  graphql(ADD_POST, { props: makeUpdateMap({ name: "addPost", cb: syncAdd }) }),
  graphql(DELETE_POST, {
    props: makeUpdateMap({ name: "deletePost", cb: syncDelete })
  }),
  graphql(EDIT_POST, { name: "editPost" }),
  withLoading
)(ABlog);
