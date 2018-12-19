import React, { Component } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";

/* Made in the spirit of material-ui-formik-components with added label for the checkbox */
export default class SingleCheckbox extends Component {
  render() {
    const {
      label,
      field: { value, ...field },
      form: { errors },
      inputProps,
      ...other
    } = this.props;
    const errorText = errors[field.name] ? (
      <FormHelperText>{errors[field.name]}</FormHelperText>
    ) : null;
    return (
      <React.Fragment>
        <FormControlLabel
          label={label}
          control={<Checkbox checked={value} {...field} {...other} />}
        />
        {errorText}
      </React.Fragment>
    );
  }
}
