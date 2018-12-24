import React, { Component } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import { Typography } from "@material-ui/core";
/* Made in the spirit of material-ui-formik-components with added label for the checkbox */
export default class CheckboxGroup extends Component {
  changeValue = ({ id, box, value }) => {
    const {
      form: { setFieldValue }
    } = this.props;
    let newArray = value.filter(ele => parseInt(ele.id) !== parseInt(box.id));
    if (newArray.length === value.length) {
      newArray.push(box);
    }
    setFieldValue(id, newArray);
  };

  render() {
    const {
      label,
      boxes,
      field: { value, ...field },
      form: { errors },
      inputProps,
      name,
      id,
      ...other
    } = this.props;
    const errorText = errors[field.name] ? (
      <FormHelperText>{errors[field.name]}</FormHelperText>
    ) : null;
    return (
      <React.Fragment>
        <Typography variant="subheading">{label}</Typography>
        {boxes.map(box => (
          <FormControlLabel
            key={box.id}
            label={box.name}
            control={
              <Checkbox
                checked={value.includes(box)}
                {...field}
                {...other}
                onChange={() => this.changeValue({ id, box, value })}
              />
            }
          />
        ))}

        {errorText}
      </React.Fragment>
    );
  }
}
