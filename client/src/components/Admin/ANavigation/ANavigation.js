import React, { Component } from "react";
import withSelection from "../../../hoc/withSelection";
import withLoading from "../../../hoc/withLoading";
import ANavigationForm from "./ANavigationForm";
import AToolbar from "../AToolbar";
import ATable, { injectButtons } from "../ATable";
import {
  FETCH_NAVIGATIONS,
  DELETE_NAVIGATIONS,
  ADD_PAGE_NAVIGATION,
  ADD_EXTERNAL_NAVIGATION,
  EDIT_PAGE_NAVIGATION,
  EDIT_EXTERNAL_NAVIGATION,
  REORDER_NAVIGATIONS
} from "../../../graphql/navigation";
import { graphql, compose } from "react-apollo";
import { makeUpdateMap } from "../../../graphql/utils";
import { getAfterId } from "../../../utils/reorder";
import {
  syncDelete,
  syncAdd,
  syncEdit,
  syncReorder
} from "./navigationMutationSyncs";

class ANavigation extends Component {
  state = {
    addForm: false,
    currentlyEditing: null
  };

  handleEdit = row => {
    this.setState({ currentlyEditing: row });
  };

  submitEdit = input => {
    const { type, id: _, __typename, ...editedNavigation } = input;
    const { id } = this.state.currentlyEditing;
    if (type === "E") {
      this.props.editExternalNavigation({ id, editedNavigation });
    } else if (type === "P") {
      this.props.editPageNavigation(
        {
          id,
          editedNavigation: {
            name: editedNavigation.name,
            shown: editedNavigation.shown,
            pageId: editedNavigation.page.id
          }
        },
        editedNavigation.page
      );
    } else {
      console.log("Input type not supplied!");
    }
    this.setState({ currentlyEditing: null });
  };

  submitAdd = input => {
    const { type, name, shown, link, page } = input;
    if (type === "E" || type === "N") {
      this.props.addExternalNavigation({
        addedNavigation: {
          name,
          shown,
          link
        }
      });
    } else if (type === "P") {
      this.props.addPageNavigation(
        {
          addedNavigation: {
            name,
            shown,
            pageId: page.id
          }
        },
        page
      );
    } else {
      console.log("Input type not supplied!");
    }
    this.setState({ addForm: false });
  };

  onDelete = ids => {
    this.props.deleteNavigations({ ids });
    this.props.flushSelected();
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { navigations } = this.props;
    let afterId = getAfterId({ oldIndex, newIndex, arr: navigations });
    this.props.reorderNavigations({
      currentId: navigations[oldIndex].id,
      afterId,
      oldIndex,
      newIndex
    });
  };
  render() {
    const { navigations, handleSelection, selected } = this.props;
    const { addForm, currentlyEditing } = this.state;
    let rows = injectButtons({
      rows: navigations,
      handleSelection,
      handleEdit: this.handleEdit
    });
    return (
      <div>
        <AToolbar
          numerator={selected.length}
          onAdd={() => this.setState({ addForm: true })}
          onDelete={() => this.onDelete(selected)}
        />
        <ATable
          rows={rows}
          onSortEnd={this.onSortEnd}
          tableFields={["drag", "select", "name", "edit"]}
          order
        />
        {addForm === true ? (
          <ANavigationForm
            title="Add Menu Item"
            onSubmit={this.submitAdd}
            onClose={() => this.setState({ addForm: false })}
          />
        ) : (
          ""
        )}

        {currentlyEditing ? (
          <ANavigationForm
            title="Edit Menu Item"
            onSubmit={this.submitEdit}
            onClose={() => this.setState({ currentlyEditing: null })}
            initialValues={currentlyEditing}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default compose(
  graphql(FETCH_NAVIGATIONS, {
    props: ({ data }) => ({
      navigations: data.navigations,
      isLoading: data.loading
    })
  }),
  graphql(DELETE_NAVIGATIONS, {
    props: makeUpdateMap({
      name: "deleteNavigations",
      cb: syncDelete
    })
  }),
  graphql(ADD_EXTERNAL_NAVIGATION, {
    props: makeUpdateMap({
      name: "addExternalNavigation",
      cb: syncAdd
    })
  }),
  graphql(ADD_PAGE_NAVIGATION, {
    props: makeUpdateMap({
      name: "addPageNavigation",
      cb: syncAdd
    })
  }),
  graphql(EDIT_PAGE_NAVIGATION, {
    props: makeUpdateMap({ name: "editPageNavigation", cb: syncEdit })
  }),
  graphql(EDIT_EXTERNAL_NAVIGATION, {
    props: makeUpdateMap({ name: "editExternalNavigation", cb: syncEdit })
  }),
  graphql(REORDER_NAVIGATIONS, {
    props: makeUpdateMap({ name: "reorderNavigations", cb: syncReorder })
  }),
  withSelection(),
  withLoading
)(ANavigation);
