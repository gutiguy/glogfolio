import React, { Component } from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "material-ui-formik-components";
import { FormTitle, FormElement, FormRow, Form } from "../Form";
import { Button } from "@material-ui/core";
import RichEditor from "../../RichEditor";
import { Value } from "slate";
import SingleCheckbox from "../Form/SingleCheckbox";
import CheckboxGroup from "../Form/CheckboxGroup";
import withLoading from "../../../hoc/withLoading";
import { graphql, compose } from "react-apollo";
import { FETCH_TAGS } from "../../../graphql/blog";

class APostForm extends Component {
  constructor(props) {
    super(props);

    if (props.editedPost && props.editedPost.posts) {
      const content = JSON.parse(props.editedPost.posts[0].content);
      this.state = { richValue: Value.fromJSON(content) };
    } else {
      this.state = {
        richValue: Value.fromJSON({
          document: {
            nodes: [
              {
                object: "block",
                type: "paragraph",
                nodes: [
                  {
                    object: "text",
                    leaves: [
                      {
                        text: "Enter new blog post."
                      }
                    ]
                  }
                ]
              }
            ]
          }
        })
      };
    }
  }

  syncFormWithEditor = value => {
    this.setState({ richValue: value });
  };

  onSubmit = values => {
    const submittedValues = {
      ...values,
      content: JSON.stringify(this.state.richValue.toJSON())
    };
    this.props.onSubmit(submittedValues);
  };

  render() {
    const { title, onClose, data } = this.props;
    let { posted_at, ...initialValues } = this.props.initialValues;
    if (posted_at === null) {
      initialValues.draft = true;
    } else {
      initialValues.draft = false;
    }
    return (
      <div>
        <FormTitle>{title}</FormTitle>
        <Formik
          onSubmit={this.onSubmit}
          initialValues={initialValues}
          validationSchema={Yup.object().shape({
            title: Yup.string()
              .min(1, "Too short!")
              .max(255, "Too long!")
              .required("Required!"),
            summary: Yup.string()
              .min(20, "Too short!")
              .max(500, "Too long!")
              .required("Required!")
          })}
        >
          {() => (
            <Form>
              <FormElement
                type="text"
                name="title"
                component={TextField}
                label="Post Title:"
                errorOnTouch
              />
              <FormElement
                type="text"
                name="summary"
                component={TextField}
                label="Short Summary:"
                errorOnTouch
              />
              <FormElement
                name="draft"
                component={SingleCheckbox}
                label="Draft"
                id="draft"
              />
              <FormElement
                name="tags"
                boxes={data.tags}
                component={CheckboxGroup}
                label="Tags"
                id="tags"
              />
              <RichEditor
                onChange={this.syncFormWithEditor}
                value={this.state.richValue}
                name="content"
              />
              <FormRow>
                <Button onClick={onClose}>Go Back</Button>
                <Button type="submit">Submit Page</Button>
              </FormRow>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

APostForm.propTypes = {
  perma: PropTypes.string,
  editedPost: PropTypes.object,
  title: PropTypes.string,
  initialValues: PropTypes.object
};

APostForm.defaultProps = {
  submitLabel: "Submit",
  title: "Form",
  date: new Date(),
  initialValues: {
    title: "",
    summary: "",
    tags: []
  },
  draft: false
};

export default compose(
  graphql(FETCH_TAGS, {
    props: ({ data }) => ({
      isLoading: data.loading,
      data
    })
  }),
  withLoading
)(APostForm);
