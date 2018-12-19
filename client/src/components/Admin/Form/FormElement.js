import React from "react";
import { Field } from "formik";
import FormRow from "./FormRow";
import { connect } from "formik";

const FormElement = props => {
  const {
    formik: { touched, errors },
    name
  } = props;
  const { errorOnTouch, ...rest } = props;
  let injectErrorProps = {};
  if (errorOnTouch) {
    injectErrorProps = {
      helperText: touched[name] && errors[name] ? errors[name] : "",
      error: touched[name] && errors[name] ? true : false
    };
  }

  return (
    <FormRow>
      <Field {...rest} {...injectErrorProps} />
    </FormRow>
  );
};

export default connect(FormElement);
