import React, { Component } from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
import { Editor } from "slate-react";
import { renderMark, renderNode } from "../RichEditor/renderMethods";
import { FETCH_PAGES } from "../../graphql/pages";
import { withLoadingAndMount } from "../../hoc/withLoading";
import { graphql, compose } from "react-apollo";
import { Value } from "slate";

class StaticPage extends Component {
  render() {
    const { pages } = this.props;
    const { content, title } = pages[0];

    let parsedContent = Value.fromJSON(JSON.parse(content));
    return (
      <div>
        <Typography variant="h5">{title}</Typography>
        <Editor
          readonly
          value={parsedContent}
          renderNode={renderNode}
          renderMark={renderMark}
        />
      </div>
    );
  }
}

StaticPage.propTypes = {
  data: PropTypes.object,
  title: PropTypes.string
};

StaticPage.defaultProps = {
  title: "Page not found",
  content: ""
};

export default compose(
  graphql(FETCH_PAGES, {
    options: ({ id }) => ({
      variables: {
        ids: [id]
      }
    }),
    props: ({ data: { pages }, data: { loading } }) => ({
      isLoading: loading,
      pages
    })
  }),
  withLoadingAndMount
)(StaticPage);
