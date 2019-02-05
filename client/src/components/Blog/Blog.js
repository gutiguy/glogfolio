import React, { Component } from "react";
import Posts from "./Posts";
import Post from "./Post";
import BlogSideBar from "./BlogSideBar";
import { Grid } from "@material-ui/core";
import {
  FETCH_POSTS_SHALLOW,
  FETCH_POST_DEEP,
  FETCH_TAGS
} from "../../graphql/blog";
import withLoading, { withLoadingAndMount } from "../../hoc/withLoading";
import { graphql, compose } from "react-apollo";
import { getYear, getMonth } from "date-fns";
import { debounce } from "debounce";

const LoadedPosts = withLoading(Posts);

const LoadedPost = compose(
  graphql(FETCH_POST_DEEP, {
    name: "deepPost",
    options: ({ id }) => ({
      variables: {
        ids: [id]
      }
    }),
    props: ({ deepPost, deepPost: { loading } }) => ({
      deepPost,
      isLoading: loading
    })
  }),
  withLoadingAndMount
)(Post);

class Blog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTags: [],
      selecteMonth: null,
      selectedYear: null,
      showPost: null
    };

    this.refetchPosts = debounce(this.refetchPosts, 700);
  }

  refetchPosts = () => {
    this.props.FetchPostsShallow.refetch({
      tags: this.state.selectedTags,
      publishStatus: "PUBLISHED"
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

  showPost = id => {
    this.setState({ showPost: id });
  };

  render() {
    const { selectedTags, selectedMonth, selectedYear, showPost } = this.state;
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
    }

    if (showPost) {
      return (
        <LoadedPost
          id={showPost}
          onClosePost={() => this.setState({ showPost: null })}
        />
      );
    }

    return (
      <Grid container spacing={24}>
        <Grid item xs={12} md={3}>
          <BlogSideBar
            tags={tags}
            selectedTags={selectedTags}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            onAddTag={this.addTag}
            onRemoveTag={this.removeTag}
            switchMonth={this.switchMonth}
            switchYear={this.switchYear}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <LoadedPosts
            isLoading={PostsLoading || TagsLoading}
            selectedTags={selectedTags}
            posts={mutatedPosts}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onOpenPost={this.showPost}
          />
        </Grid>
      </Grid>
    );
  }
}

export default compose(
  graphql(FETCH_POSTS_SHALLOW, {
    name: "FetchPostsShallow",
    options: {
      variables: {
        tags: null,
        publishStatus: "PUBLISHED"
      }
    }
  }),
  graphql(FETCH_TAGS, {
    name: "FetchTags"
  }),
  withLoading
)(Blog);
