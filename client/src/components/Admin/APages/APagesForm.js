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

class APagesForm extends Component {
  constructor(props) {
    super(props);

    if (props.editedPage && props.editedPage.pages) {
      const content = JSON.parse(props.editedPage.pages[0].content);
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
                        text: "A line of text in a paragraph."
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
    const { title, onClose, editedPage } = this.props;
    let initialValues = this.props.initialValues;
    if (editedPage && editedPage.pages) {
      const {
        content: _,
        __typename: __,
        ...tempInitialValues
      } = this.props.editedPage.pages[0];

      initialValues = tempInitialValues;
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
            perma: Yup.string()
              .min(2, "Too short!")
              .max(255, "Too long!")
              .required("Required!")
          })}
        >
          {() => (
            <Form>
              <FormElement
                type="text"
                name="title"
                component={TextField}
                label="Page Title:"
                errorOnTouch
              />
              <FormElement
                type="text"
                name="perma"
                component={TextField}
                label="Perma Link:"
                errorOnTouch
              />
              <FormElement
                name="draft"
                component={SingleCheckbox}
                label="Draft"
                id="draft"
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

APagesForm.propTypes = {
  perma: PropTypes.string,
  editedPage: PropTypes.object,
  title: PropTypes.string,
  initialValues: PropTypes.object
};

APagesForm.defaultProps = {
  submitLabel: "Submit",
  title: "Form",
  editedPage: null,
  initialValues: {
    title: "",
    perma: ""
  },
  draft: false
};

export default APagesForm;
