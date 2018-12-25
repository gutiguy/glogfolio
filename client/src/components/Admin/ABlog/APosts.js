import React, { Component } from "react";

import styled from "styled-components";

import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  IconButton
} from "@material-ui/core";

import { Edit, Delete } from "@material-ui/icons";

const MarginCard = styled(Card)`
  margin-top: 1rem;
`;

class APosts extends Component {
  render() {
    const { posts, onEdit, onDelete } = this.props;
    return (
      <div>
        {posts.map(post => (
          <MarginCard key={post.id}>
            <CardHeader title={post.title} />
            <CardContent>
              <Typography component="p">
                {post.summary || "No Summary Provided"}
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton aria-label="Edit" onClick={() => onEdit(post)}>
                <Edit />
              </IconButton>
              <IconButton aria-label="Edit" onClick={() => onDelete(post.id)}>
                <Delete />
              </IconButton>
            </CardActions>
          </MarginCard>
        ))}
      </div>
    );
  }
}

APosts.defaultProps = {
  posts: []
};

export default APosts;
