import Typography from "@material-ui/core/Typography";
import React from "react";

/**
 * Render a Slate node.
 *
 * @param {Object} props
 * @return {Element}
 */

const renderNode = (props, editor, next) => {
  const { attributes, children, node } = props;

  switch (node.type) {
    case "title":
      return (
        <Typography variant="headline" {...attributes}>
          {children}
        </Typography>
      );
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    default:
      return next();
  }
};

/**
 * Render a Slate mark.
 *
 * @param {Object} props
 * @return {Element}
 */

const renderMark = (props, editor, next) => {
  const { children, mark, attributes } = props;

  switch (mark.type) {
    case "bold":
      return <strong {...attributes}>{children}</strong>;
    case "code":
      return <code {...attributes}>{children}</code>;
    case "italic":
      return <em {...attributes}>{children}</em>;
    case "underlined":
      return <u {...attributes}>{children}</u>;
    default:
      return next();
  }
};

export { renderNode, renderMark };
