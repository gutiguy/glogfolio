import React, { Component } from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField, Select } from "material-ui-formik-components";
import { FormContainer, FormTitle, FormElement, FormRow, Form } from "../Form";
import { Button } from "@material-ui/core";
import SingleCheckbox from "../Form/SingleCheckbox";
import { graphql, compose } from "react-apollo";
import { FETCH_PAGES_SHALLOW_WITH_PERMA } from "../../../graphql/pages";
import withLoading from "../../../hoc/withLoading";

class ANavigationForm extends Component {
  render() {
    const { initialValues, onClose, pages } = this.props;
    let typeElement = () => null;
    if (initialValues.type === "N") {
      typeElement = ({ values }) => (
        <FormElement
          component={Select}
          options={[
            { value: "E", label: "External Link" },
            { value: "P", label: "Page" }
          ]}
          label="Item Type"
          name="type"
          value={(values.type !== "N" && values.type) || "E"}
        />
      );
    }
    return (
      <FormContainer onClose={onClose}>
        <FormTitle>Navigation Form</FormTitle>
        <Formik
          onSubmit={this.props.onSubmit}
          initialValues={initialValues}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .min(1, "Too short!")
              .max(255, "Too long!")
              .required("Required!"),
            link: Yup.string()
              .min(2, "Too short!")
              .max(255, "Too long!")
          })}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <FormElement
                type="text"
                name="name"
                component={TextField}
                label="Item Name:"
                errorOnTouch
              />
              {typeElement({ values })}
              {values.type === "E" || values.type === "N" ? (
                <FormElement
                  type="text"
                  name="link"
                  component={TextField}
                  label="URL:"
                  errorOnTouch
                />
              ) : (
                <FormElement
                  component={Select}
                  options={[
                    { value: -1, label: "Choose Page" },
                    ...pages.map(page => ({
                      value: page.id,
                      label: page.title
                    }))
                  ]}
                  label="Page"
                  name="pageId"
                  value={values.page.id}
                  onChange={e => {
                    let perma = "";
                    let findPage = pages.find(
                      page => page.id === e.target.value
                    );
                    if (findPage) {
                      perma = findPage.perma;
                    }
                    setFieldValue("page", {
                      id: e.target.value,
                      perma
                    });
                  }}
                />
              )}
              <FormElement
                component={SingleCheckbox}
                label="Shown"
                name="shown"
                id="shown"
              />
              <FormRow>
                <Button type="submit">Submit Item</Button>
              </FormRow>
            </Form>
          )}
        </Formik>
      </FormContainer>
    );
  }
}

ANavigationForm.propTypes = {
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  handleSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  onClose: PropTypes.func
};

ANavigationForm.defaultProps = {
  initialValues: {
    name: "",
    link: "",
    type: "N",
    page: { id: -1 },
    shown: true
  },
  onClose: () => {
    console.log("An onClose callback function must be provided");
  }
};

export default compose(
  graphql(FETCH_PAGES_SHALLOW_WITH_PERMA, {
    props: ({ data }) => ({ pages: data.pages, isLoading: data.loading })
  }),
  withLoading
)(ANavigationForm);
