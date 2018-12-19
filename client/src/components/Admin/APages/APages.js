import React, { Component } from "react";
import withSelection from "../../../hoc/withSelection";
import withLoading from "../../../hoc/withLoading";
import AToolbar from "../AToolbar";
import ATable, { injectButtons } from "../ATable";
import APagesForm from "./APagesForm";
import { graphql, compose } from "react-apollo";

import {
  FETCH_PAGES_SHALLOW,
  FETCH_PAGES,
  ADD_PAGE,
  EDIT_PAGE,
  DELETE_PAGES
} from "../../../graphql/pages";

import { makeUpdateMap } from "../../../graphql/utils";

const APagesEditForm = compose(
  graphql(FETCH_PAGES, {
    name: "editedPage",
    options: ({ id }) => ({
      variables: {
        ids: [id]
      }
    }),
    props: ({ editedPage, editedPage: { loading } }) => ({
      editedPage,
      isLoading: loading
    })
  }),
  withLoading
)(APagesForm);

class APages extends Component {
  state = {
    currentlyEditing: null,
    addForm: false
  };

  onAdd = addedPage => {
    this.props.addPage({ addedPage });
    this.setState({ addForm: false });
  };

  onEdit = ({ id, ...editedPage }) => {
    this.props.editPage({ id, editedPage });
    this.setState({ currentlyEditing: null });
  };

  onDelete = ids => {
    this.props.deletePages({ ids });
    this.props.flushSelected();
  };

  render() {
    const { currentlyEditing, addForm } = this.state;
    const { pages, handleSelection, selected } = this.props;
    const rows = injectButtons({
      rows: pages,
      handleEdit: row => this.setState({ currentlyEditing: row }),
      handleSelection
    });
    let toRender = (
      <React.Fragment>
        <AToolbar
          onDelete={() => this.onDelete(selected)}
          onAdd={() => this.setState({ addForm: true })}
          numerator={selected.length}
        />
        <ATable rows={rows} tableFields={["select", "title", "edit"]} />
      </React.Fragment>
    );
    if (addForm) {
      toRender = (
        <APagesForm
          title="Add Page"
          onSubmit={this.onAdd}
          onClose={() => this.setState({ addForm: false })}
        />
      );
    } else if (currentlyEditing) {
      toRender = (
        <APagesEditForm
          title="Edit Page"
          id={currentlyEditing.id}
          onSubmit={this.onEdit}
          onClose={() => this.setState({ currentlyEditing: null })}
        />
      );
    }

    return <div>{toRender}</div>;
  }
}

const syncAdd = pageInput => (
  proxy,
  {
    data: {
      addPage: { id }
    }
  }
) => {
  const addedPage = { id, ...pageInput.addedPage, __typename: "Page" };
  const { pages } = proxy.readQuery({ query: FETCH_PAGES_SHALLOW });
  let mutatedPages = [...pages];
  mutatedPages.push(addedPage);
  proxy.writeQuery({
    query: FETCH_PAGES_SHALLOW,
    data: { pages: mutatedPages }
  });
};

const syncEdit = ({ id, editedPage }) => proxy => {
  const { pages } = proxy.readQuery({
    query: FETCH_PAGES,
    variables: { ids: [id] }
  });
  const mutatedPageIndex = pages.map(page => page.id).indexOf(id);
  const mutatedPages = [
    ...pages.slice(0, mutatedPageIndex),
    { id, ...editedPage, __typename: "Page" },
    ...pages.slice(mutatedPageIndex + 1, pages.length)
  ];
  proxy.writeQuery({ query: FETCH_PAGES, data: { pages: mutatedPages } });
};

const syncDelete = ({ ids }) => proxy => {
  const { pages } = proxy.readQuery({
    query: FETCH_PAGES_SHALLOW
  });
  const mutatedPages = pages.filter(page => !ids.includes(page.id));
  proxy.writeQuery({
    query: FETCH_PAGES_SHALLOW,
    data: { pages: mutatedPages }
  });
};

export default compose(
  graphql(FETCH_PAGES_SHALLOW, {
    props: ({ data: { pages, loading } }) => {
      return { pages, isLoading: loading };
    }
  }),
  graphql(ADD_PAGE, {
    props: makeUpdateMap({
      name: "addPage",
      cb: syncAdd
    })
  }),
  graphql(EDIT_PAGE, {
    props: makeUpdateMap({
      name: "editPage",
      cb: syncEdit
    })
  }),
  graphql(DELETE_PAGES, {
    props: makeUpdateMap({
      name: "deletePages",
      cb: syncDelete
    })
  }),
  withSelection(),
  withLoading
)(APages);
