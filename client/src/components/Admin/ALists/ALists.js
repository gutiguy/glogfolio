import React, { Component } from "react";
import _ from "lodash";

// API
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";

// Hocs
import withSelection from "../../../hoc/withSelection";
import withLoading from "../../../hoc/withLoading";

// UI
import { MenuItem, Select, FormControl } from "@material-ui/core";
import ATable, { injectButtons } from "../ATable";
import AToolbar from "../AToolbar";
import AListsForm from "./AListsForm";
import { swapArrayElements, getAfterId } from "../../../utils/reorder";

const FETCH_LISTS = gql`
  query {
    listTypes {
      name
      id
      lists {
        id
        name
        link
      }
    }
  }
`;

const ADD_LIST = gql`
  mutation AddList($addedList: ListInput!) {
    addList(addedList: $addedList) {
      id
      name
      link
      listType {
        id
      }
    }
  }
`;

const DELETE_LISTS = gql`
  mutation DeleteLists($ids: [ID]!) {
    deleteLists(ids: $ids)
  }
`;

const EDIT_LISTS = gql`
  mutation EditLists($id: ID!, $editedList: ListInput!) {
    editList(id: $id, editedList: $editedList) {
      id
      name
      link
    }
  }
`;

const REORDER_LISTS = gql`
  mutation ReorderLists($afterId: ID, $currentId: ID!, $listTypeId: ID!) {
    reorderLists(
      afterId: $afterId
      currentId: $currentId
      listTypeId: $listTypeId
    )
  }
`;

class ALists extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentList: 0,
      addForm: false,
      currentlyEditing: 0
    };
  }

  handleCloseAddForm = () => {
    this.setState({ addForm: false });
  };

  submitAdd = async values => {
    await this.props.addList({
      variables: {
        addedList: {
          ...values,
          listTypeId: this.props.listTypes[this.state.currentList].id
        }
      }
    });

    this.setState({ addForm: false });
  };

  submitEdit = async ({ id, name, link }) => {
    const listTypeId = this.props.listTypes[this.state.currentList].id;
    await this.props.editList({
      variables: {
        id,
        editedList: { name, link, listTypeId }
      }
    });

    this.setState({ currentlyEditing: null });
  };

  handleEdit = row => {
    this.setState({ currentlyEditing: row });
  };

  syncReorder = (proxy, { oldIndex, newIndex, currentTypeIndex }) => {
    const { listTypes } = proxy.readQuery({ query: FETCH_LISTS });
    let mutatedList = swapArrayElements(
      listTypes[currentTypeIndex].lists,
      oldIndex,
      newIndex
    );
    let mutatedListTypes = [...listTypes];
    mutatedListTypes[currentTypeIndex] = {
      ...mutatedListTypes[currentTypeIndex]
    };
    mutatedListTypes[currentTypeIndex].lists = mutatedList;
    proxy.writeQuery({
      query: FETCH_LISTS,
      data: { listTypes: mutatedListTypes }
    });
  };

  onSortEnd = async ({ oldIndex, newIndex }) => {
    const { currentList } = this.state;
    let afterId = getAfterId({
      oldIndex,
      newIndex,
      arr: this.props.listTypes[currentList].lists
    });

    const listTypeId = this.props.listTypes[currentList].id;
    const currentId = this.props.listTypes[currentList].lists[oldIndex].id;

    this.props.reorderLists({
      variables: {
        afterId,
        currentId,
        listTypeId
      },
      update: proxy =>
        this.syncReorder(proxy, {
          oldIndex,
          newIndex,
          currentTypeIndex: currentList
        })
    });
  };

  syncDeletion = (ids, proxy) => {
    const { listTypes } = proxy.readQuery({ query: FETCH_LISTS });
    listTypes[this.state.currentList].lists = listTypes[
      this.state.currentList
    ].lists.filter(list => !ids.includes(list.id));
    proxy.writeQuery({ query: FETCH_LISTS, data: { listTypes } });
  };

  handleDelete = async ids => {
    const deletedLists = await this.props.deleteLists({
      variables: { ids },
      update: proxy => this.syncDeletion(ids, proxy)
    });
    this.props.flushSelected();
    if (deletedLists === typeof "undefined") {
      console.log("something went terribly wrong");
    }
  };

  changeListType = e => {
    this.setState({ currentList: e.target.value });
  };

  render() {
    const { listTypes, selected, handleSelection } = this.props;
    const { currentList, currentlyEditing, addForm } = this.state;
    let rows = listTypes.length === 0 ? [] : [...listTypes[currentList].lists];
    rows = injectButtons({
      rows,
      handleSelection,
      handleEdit: this.handleEdit
    });
    return (
      <div>
        <AToolbar
          numerator={selected.length}
          onAdd={() => this.setState({ addForm: true })}
          onDelete={() => this.handleDelete(selected)}
        >
          <FormControl>
            <Select
              value={currentList}
              onChange={this.changeListType}
              name="List Type"
            >
              {listTypes.map((type, index) => (
                <MenuItem key={type.id} value={index}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AToolbar>
        <ATable
          rows={rows}
          onSortEnd={this.onSortEnd}
          tableFields={["drag", "select", "name", "edit"]}
          order
        />

        {addForm === true ? (
          <AListsForm
            title="Add List"
            onSubmit={this.submitAdd}
            onClose={() => this.setState({ addForm: false })}
          />
        ) : (
          ""
        )}

        {currentlyEditing ? (
          <AListsForm
            title="Edit List"
            onSubmit={this.submitEdit}
            onClose={() => this.setState({ currentlyEditing: 0 })}
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
  graphql(FETCH_LISTS, {
    props: ({ data: { listTypes, loading } }) => ({
      listTypes,
      isLoading: loading
    })
  }),
  graphql(ADD_LIST, {
    name: "addList",
    options: {
      update: (proxy, { data: { addList } }) => {
        const data = proxy.readQuery({ query: FETCH_LISTS });
        const listTypes = _.cloneDeep(data.listTypes);
        listTypes[
          listTypes.findIndex(listType => listType.id === addList.listType.id)
        ].lists.push(addList);
        proxy.writeQuery({ query: FETCH_LISTS, data: { listTypes } });
      }
    }
  }),
  graphql(DELETE_LISTS, {
    name: "deleteLists"
  }),
  graphql(EDIT_LISTS, {
    name: "editList"
  }),
  graphql(REORDER_LISTS, {
    name: "reorderLists"
  }),
  withLoading,
  withSelection()
)(ALists);
