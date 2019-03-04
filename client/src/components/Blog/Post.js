import React from "react";
import PropTypes from "prop-types";
import { Button, Typography } from "@material-ui/core";
import { Editor } from "slate-react";
import { renderMark, renderNode } from "../RichEditor/renderMethods";
import { Value } from "slate";
import { ISOStringToNormalDate } from "../../utils/date";
import PaddedPaper from "../PaddedPaper/PaddedPaper";
import { StyledLoader } from "../../hoc/withLoading";

function Post(props) {
  const { deepPost, onClosePost } = props;
  const { posts } = deepPost;

  if (!posts) {
    return <StyledLoader />;
  }

  const { content, title, posted_at, tags } = posts[0];
  const parsedContent = Value.fromJSON(JSON.parse(content));

  return (
    <PaddedPaper>
      <Typography variant="h4">{title}</Typography>
      <Typography variant="subtitle1">
        Posted at {ISOStringToNormalDate(posted_at)}
      </Typography>
      <Editor
        readonly
        value={parsedContent}
        renderNode={renderNode}
        renderMark={renderMark}
        style={{ marginBottom: "1rem", marginTop: "1rem" }}
      />

      {tags.length ? (
        <Typography variant="caption" style={{ marginBottom: "1rem" }}>
          Tags: {tags.map(tag => tag.name)}
        </Typography>
      ) : null}

      <Button onClick={onClosePost}>Back To Posts</Button>
    </PaddedPaper>
  );
}

Post.propTypes = {
  deepPost: PropTypes.object,
  title: PropTypes.string
};

Post.defaultProps = {
  title: "",
  tags: []
};

export default Post;
