import React, { Component } from "react";
import { Flag } from "@material-ui/icons";
import { Popover, Grid, Paper, IconButton, Button } from "@material-ui/core";
import { TextField } from "material-ui-formik-components";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";
import { graphql, compose } from "react-apollo";
import styled from "styled-components";
import { FETCH_TAGS, ADD_EDIT_AND_DELETE_TAGS } from "../../../graphql/blog";
import withLoading from "../../../hoc/withLoading";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Formik, Form, Field } from "formik";

const PaddedPaper = styled(Paper)`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

class ATagsInput extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      anchorEl: null,
      addedTags: [],
      deletedTags: [],
      editedTags: [],
      currentlyEditing: null
    };
    this.state = this.initialState;
  }

  handleSave = async () => {
    const { addedTags, deletedTags, editedTags } = this.state;
    await this.props.addEditAndDeleteTags({
      variables: {
        addedTags: addedTags.map(tag => ({
          name: tag.name
        })),
        deletedTags,
        editedTags: this.props.tags.reduce((acc, tag) => {
          if (editedTags[tag.id]) {
            acc.push({ id: tag.id, name: editedTags[tag.id] });
          }
          return acc;
        }, [])
      }
    });
  };

  handleDelete(id) {
    /* If Id<0 we remove from the addedTags array */
    if (id < 0) {
      let mutatedTags = [...this.state.addedTags];
      this.setState({ addedTags: mutatedTags.filter(tag => tag.id !== id) });
    } else {
      /* Else remove from the normal tags */
      let deletedTags = [...this.state.deletedTags];
      deletedTags.push(id);
      this.setState({ deletedTags });
    }
  }

  generateTagJSX = tag => {
    const { currentlyEditing } = this.state;
    return (
      <Grid item xs={4} id={tag.id} key={tag.id}>
        {currentlyEditing === tag.id ? (
          <Formik
            initialValues={{ editTagName: tag.name }}
            onSubmit={({ editTagName }) => {
              if (editTagName === tag.name) {
                this.setState({ currentlyEditing: null });
              } else {
                const editedTags = { ...this.state.editedTags };
                editedTags[tag.id] = editTagName;
                this.setState({ editedTags, currentlyEditing: null });
              }
            }}
          >
            {() => (
              <Form>
                <Field
                  component={TextField}
                  placeholder="Add Tag"
                  style={{ width: "100%" }}
                  name="editTagName"
                />
              </Form>
            )}
          </Formik>
        ) : (
          <span style={{ verticalAlign: "center" }}>
            <Button
              size="small"
              onClick={() => this.setState({ currentlyEditing: tag.id })}
            >
              {tag.name}
            </Button>
            <IconButton
              disableRipple
              disableTouchRipple
              onClick={() => this.handleDelete(tag.id)}
            >
              <DeleteIcon />
            </IconButton>
          </span>
        )}
      </Grid>
    );
  };

  render() {
    const { anchorEl, addedTags, deletedTags, editedTags } = this.state;
    const { tags } = this.props;
    const mutatedTags = tags.reduce((acc, tag) => {
      if (deletedTags.includes(tag.id)) return acc;
      if (editedTags[tag.id]) {
        acc.push({ id: tag.id, name: editedTags[tag.id] });
      } else acc.push(tag);
      return acc;
    }, []);
    const open = Boolean(anchorEl);
    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={e => this.setState({ anchorEl: e.currentTarget })}
        >
          <Flag />
          Edit Tags
        </Button>
        <Popover
          id="TagsPopper"
          open={open}
          anchorEl={anchorEl}
          onClose={() => this.setState({ anchorEl: null })}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
        >
          <PaddedPaper>
            <Grid
              alignItems="center"
              justify="center"
              container
              style={{ minWidth: "25vw", margin: "0 auto" }}
            >
              {mutatedTags.map(this.generateTagJSX)}
              {addedTags.map(this.generateTagJSX)}
              <Grid item xs={4} id="addTag">
                <Formik
                  initialValues={{ addTagName: "" }}
                  onSubmit={({ addTagName }, { resetForm }) => {
                    console.log("shalom");
                    const addedTags = [...this.state.addedTags];
                    addedTags.push({
                      name: addTagName,
                      id: -addedTags.length - 1
                    });
                    resetForm({ addTagName: "" });
                    this.setState({ addedTags: [...addedTags] });
                  }}
                >
                  {() => (
                    <Form>
                      <Field
                        component={TextField}
                        placeholder="Add Tag"
                        style={{ width: "100%" }}
                        name="addTagName"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">+</InputAdornment>
                          )
                        }}
                      />
                    </Form>
                  )}
                </Formik>
              </Grid>
            </Grid>
            <Grid container justify="center" spacing={24}>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => this.setState(this.initialState)}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  size="small"
                  onClick={this.handleSave}
                >
                  <SaveIcon />
                  Save
                </Button>
              </Grid>
            </Grid>
          </PaddedPaper>
        </Popover>
      </div>
    );
  }
}

export default compose(
  graphql(FETCH_TAGS, {
    props: ({ data }) => ({ tags: data.tags, isLoading: data.loading })
  }),
  graphql(ADD_EDIT_AND_DELETE_TAGS, { name: "addEditAndDeleteTags" }),
  withLoading
)(ATagsInput);
