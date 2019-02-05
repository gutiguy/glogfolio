import React, { Component } from "react";

import styled from "styled-components";

import { Card, CardContent, CardHeader, Typography } from "@material-ui/core";

import CardActionArea from "@material-ui/core/CardActionArea";

const MarginCard = styled(Card)`
  margin-top: 1rem;
`;

class Posts extends Component {
  render() {
    const { posts, onOpenPost } = this.props;
    return (
      <div>
        {posts.map(post => (
          <MarginCard key={post.id} onClick={() => onOpenPost(post.id)}>
            <CardActionArea>
              <CardHeader
                title={post.title}
                subheader={
                  "Posted at " +
                  post.posted_at.substring(0, 10) +
                  " " +
                  post.posted_at.substring(11, 19)
                }
              />
              <CardContent>
                <Typography component="p">
                  {post.summary || "No Summary Provided"}
                </Typography>
              </CardContent>
            </CardActionArea>
          </MarginCard>
        ))}
      </div>
    );
  }
}

Posts.defaultProps = {
  posts: [],
  onOpenPost: () => console.warn("No showPost function prop defined.")
};

export default Posts;
