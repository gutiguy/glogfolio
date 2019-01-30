import React, { Component } from "react";
import APosts from "./APosts";
import BlogSideBar from "./BlogSideBar";
import { Grid, FormControl, Select, MenuItem } from "@material-ui/core";
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
import withLoading, { withLoadingAndMount } from "../../../hoc/withLoading";
import { graphql, compose } from "react-apollo";
import { makeUpdateMap, stripTypenames } from "../../../graphql/utils";
import ATagsInput from "./ATagsInput";
import { getYear, getMonth } from "date-fns";

const APostsLoading = withLoading(APosts);

let PublishEnum = Object.freeze({ published: 0, draft: 1, all: 2 });

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
  withLoadingAndMount
)(APostForm);

class ABlog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addForm: false,
      currentlyEditing: null,
      selectedTags: [],
      publishStatus: PublishEnum.all, // Published, Draft or all
      selecteMonth: null,
      selectedYear: null
    };

    this.refetchPosts = debounce(this.refetchPosts, 700);
  }

  refetchPosts = () => {
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

  switchYear = year => {
    const { selectedYear } = this.state;
    if (year === selectedYear) {
      this.setState({ selectedYear: null, selecteMonth: null });
    } else {
      this.setState({ selectedYear: year, selecteMonth: null });
    }
  };

  switchMonth = month => {
    const { selectedMonth } = this.state;
    if (month === selectedMonth) {
      this.setState({ selectedMonth: null });
    } else {
      this.setState({ selectedMonth: month });
    }
  };

  submitAdd = input => {
    const { draft, ...addedPost } = input;
    let publishStatus;
    if (draft === true) {
      publishStatus = "DRAFT";
    } else {
      publishStatus = "PUBLISHED";
    }
    addedPost.tags = addedPost.tags.map(tag => tag.id);
    this.props.addPost({ addedPost, publishStatus });
    this.setState({ addForm: false });
  };

  submitDelete = id => {
    this.props.deletePost({ id });
  };

  submitEdit = async input => {
    const { id, tags, draft, ...editedPost } = input;
    // If draft wasn't changed we signal that to the server (so that it doesn't reset the "posted at" date to the current date)
    // If we want to coerce the server to reset the posted at date every time an undrafted page gets edited we can remove this condition.
    let publishStatus;
    if (draft === true && this.state.currentlyEditing.posted_at !== null) {
      publishStatus = "DRAFT";
    } else if (
      draft === false &&
      this.state.currentlyEditing.posted_at === null
    ) {
      publishStatus = "PUBLISHED";
    }
    await this.props.editPost({
      variables: {
        id,
        publishStatus,
        editedPost: {
          ...stripTypenames(editedPost),
          tags: tags.map(tag => tag.id)
        }
      }
    });
    this.setState({ currentlyEditing: null });
  };

  changePublishStatus = e => {
    this.setState({ publishStatus: e.target.value });
  };
  render() {
    const {
      addForm,
      currentlyEditing,
      selectedTags,
      selectedMonth,
      selectedYear,
      publishStatus
    } = this.state;
    const { posts, loading: PostsLoading } = this.props.FetchPostsShallow;
    const { tags, loading: TagsLoading } = this.props.FetchTags;
    let mutatedPosts = [];
    if (posts) {
      mutatedPosts = [...posts];
      if (selectedYear) {
        mutatedPosts = mutatedPosts.filter(
          post => getYear(post.posted_at) === selectedYear
        );
      }
      if (selectedMonth) {
        mutatedPosts = mutatedPosts.filter(
          post => getMonth(post.posted_at) === selectedMonth - 1
        );
      }
      if (publishStatus !== PublishEnum.all) {
        if (publishStatus === PublishEnum.draft) {
          mutatedPosts = mutatedPosts.filter(post => post.posted_at === null);
        } else {
          mutatedPosts = mutatedPosts.filter(post => post.posted_at !== null);
        }
      }
    }
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
          <FormControl>
            <Select
              value={publishStatus}
              onChange={this.changePublishStatus}
              name="PublishStatus"
            >
              {Object.entries(PublishEnum).map(type => {
                return (
                  <MenuItem key={type[1]} value={type[1]}>
                    {type[0] && type[0].toUpperCase()}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </AToolbar>
        <Grid container spacing={24}>
          <Grid item xs={8}>
            <APostsLoading
              isLoading={PostsLoading || TagsLoading}
              selectedTags={selectedTags}
              posts={mutatedPosts}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
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
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              switchMonth={this.switchMonth}
              switchYear={this.switchYear}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default compose(
  graphql(FETCH_POSTS_SHALLOW, {
    name: "FetchPostsShallow",
    variables: {
      tags: null
    }
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
