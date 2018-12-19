import React, { Component } from "react";
import PropTypes from "prop-types";

import { Button } from "@material-ui/core";

import { Formik } from "formik";
import { TextField } from "material-ui-formik-components";
import { FormContainer, FormTitle, FormElement, FormRow, Form } from "../Form";

class AListsForm extends Component {
  render() {
    const { title, submitLabel, onSubmit, initialValues, onClose } = this.props;
    return (
      <FormContainer onClose={onClose}>
        <FormTitle>{title}</FormTitle>
        <Formik onSubmit={onSubmit} initialValues={initialValues}>
          {() => (
            <Form>
              <FormElement
                type="text"
                name="name"
                component={TextField}
                label="List Name:"
              />
              <FormElement
                type="text"
                name="link"
                component={TextField}
                label="Link Url:"
              />
              <FormRow>
                <Button type="submit">{submitLabel}</Button>
              </FormRow>
            </Form>
          )}
        </Formik>
      </FormContainer>
    );
  }
}

AListsForm.propTypes = {
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  onClose: PropTypes.func
};

AListsForm.defaultProps = {
  initialValues: {
    name: "",
    link: ""
  },
  submitLabel: "Submit"
};

export default AListsForm;
