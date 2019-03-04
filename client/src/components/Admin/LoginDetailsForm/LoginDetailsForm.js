import React, { Component } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "material-ui-formik-components";
import { FormTitle, FormElement, FormRow, Form } from "../Form";
import { Button, IconButton, Typography } from "@material-ui/core";
import Edit from "@material-ui/icons/Edit";
import { connect } from "react-redux";
import ValidatePasswordForm from "./ValidatePasswordForm";
import axios from "axios";
import CustomDialog from "../CustomDialog";

const { REACT_APP_BACKEND_URL } = process.env;

class LoginDetailsForm extends Component {
  constructor(props) {
    super(props);

    this.initialState = Object.freeze({
      editUserName: false,
      editPassword: false,
      passedValues: null,
      requestStatus: null
    });

    this.state = this.initialState;
  }

  onSubmit = values => {
    this.setState({ passedValues: values });
  };

  onVerifySubmit = async values => {
    const { editUserName, editPassword } = this.state;

    let changeObject = { password: values.password };
    if (editUserName) {
      changeObject = { ...changeObject, username: values.username };
    }
    if (editPassword) {
      changeObject = { ...changeObject, newPassword: values.newpassword };
    }

    const res = await axios.post(
      REACT_APP_BACKEND_URL + "/api/admin/change_info",
      changeObject
    );
    this.setState({ ...this.initialState, requestStatus: res.status });
  };

  render() {
    const {
      editUserName,
      editPassword,
      passedValues,
      requestStatus
    } = this.state;

    let displayDialog = null;

    if (requestStatus != null) {
      if (requestStatus === 200)
        displayDialog = (
          <CustomDialog
            title="Success!"
            text="Login data updated successfuly."
            onDismiss={() => {
              this.setState(this.initialState);
            }}
            status={requestStatus}
          />
        );
      else
        displayDialog = (
          <CustomDialog
            title="Failed to make Changes"
            text="If the issue persists please contact your system administrator."
            onDismiss={() => {
              this.setState(this.initialState);
            }}
            status={requestStatus}
          />
        );
    }

    const { username } = this.props;
    let validationObject;

    if (editUserName) {
      validationObject = {
        username: Yup.string().required("Username is required.")
      };
    }
    if (editPassword) {
      validationObject = {
        ...validationObject,
        newpassword: Yup.string().required("Password is required."),
        newpasswordConfirm: Yup.string()
          .oneOf([Yup.ref("newpassword"), null], "Passwords don't match")
          .required("Confirm Password is required")
      };
    }

    const validationSchema = Yup.object(validationObject);
    return (
      <div>
        {displayDialog}
        {passedValues != null ? (
          <ValidatePasswordForm
            values={passedValues}
            onClose={() => this.setState({ passedValues: null })}
            onSubmit={this.onVerifySubmit}
          />
        ) : null}
        <React.Fragment>
          <FormTitle>Edit Login Information</FormTitle>
          <Formik
            onSubmit={this.onSubmit}
            validationSchema={validationSchema}
            initialValues={{
              username: username,
              newpassword: "",
              newpasswordConfirm: ""
            }}
          >
            {() => (
              <Form>
                {editUserName ? (
                  <FormElement
                    type="text"
                    name="username"
                    component={TextField}
                    label="New Username:"
                    errorOnTouch
                  />
                ) : (
                  <FormRow centerContent>
                    <Typography variant="h6">
                      Username: {username}
                      <IconButton
                        onClick={() => this.setState({ editUserName: true })}
                      >
                        <Edit />
                      </IconButton>
                    </Typography>
                  </FormRow>
                )}
                {editPassword ? (
                  <React.Fragment>
                    <FormElement
                      type="password"
                      name="newpassword"
                      component={TextField}
                      label="New Password"
                      errorOnTouch
                    />
                    <FormElement
                      type="password"
                      name="newpasswordConfirm"
                      component={TextField}
                      label="Confirm New Password"
                      errorOnTouch
                    />
                  </React.Fragment>
                ) : (
                  <FormRow width={50} centerContent>
                    <Typography variant="h6">
                      Password: ******
                      <IconButton
                        onClick={() => this.setState({ editPassword: true })}
                      >
                        <Edit />
                      </IconButton>
                    </Typography>
                  </FormRow>
                )}
                {editUserName || editPassword ? (
                  <FormRow>
                    <Button type="submit">Save Changes</Button>
                    <Button
                      type="cancel"
                      onClick={() =>
                        this.setState({
                          editUserName: false,
                          editPassword: false
                        })
                      }
                    >
                      Discard Changes
                    </Button>
                  </FormRow>
                ) : null}
              </Form>
            )}
          </Formik>
        </React.Fragment>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.admin.username
  };
};

export default connect(mapStateToProps)(LoginDetailsForm);
