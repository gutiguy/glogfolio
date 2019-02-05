import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "@material-ui/core";
import { Formik } from "formik";
import { TextField } from "material-ui-formik-components";
import { FormContainer, FormTitle, FormElement, FormRow, Form } from "../Form";

class ValidatePasswordForm extends Component {
  render() {
    const { onSubmit, initialValues, onClose, values } = this.props;
    return (
      <FormContainer onClose={onClose}>
        <FormTitle>Please enter current password to submit changes</FormTitle>
        <Formik
          onSubmit={password => onSubmit({ ...password, ...values })}
          initialValues={initialValues}
        >
          {() => (
            <Form>
              <FormElement
                type="password"
                name="password"
                component={TextField}
                label="password"
              />
              <FormRow>
                <Button type="submit">Send</Button>
              </FormRow>
            </Form>
          )}
        </Formik>
      </FormContainer>
    );
  }
}

ValidatePasswordForm.propTypes = {
  submitLabel: PropTypes.string,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  onClose: PropTypes.func
};

ValidatePasswordForm.defaultProps = {
  initialValues: {
    password: ""
  }
};

export default ValidatePasswordForm;
