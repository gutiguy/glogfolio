import React, { Component } from "react";
import PropTypes from "prop-types";

import { Button } from "@material-ui/core";

import { Formik, ErrorMessage } from "formik";
import { TextField } from "material-ui-formik-components";
import { FormContainer, FormTitle, FormElement, FormRow, Form } from "../Form";

import ImageUploader from "../ImageUploader";
import { ImagePreview } from "../ImageUploader";
import CheckboxTree from "../CheckboxTree";
import { Grid } from "@material-ui/core";
import * as Yup from "yup";

const { REACT_APP_AWS_BUCKET_URI } = process.env;

class APortfolioForm extends Component {
  state = {
    image: null,
    selectedCategories: this.props.initialValues.categories || []
  };

  appendImage = image => {
    this.setState({ image });
  };

  handleTreeSelect = async nodeId => {
    let selectedCategories = [...this.state.selectedCategories];
    let index = selectedCategories.indexOf(nodeId);
    if (index !== -1) {
      selectedCategories.splice(index, 1);
    } else selectedCategories.push(nodeId);
    this.setState({ selectedCategories });
  };

  onSubmit = (values, bag) => {
    this.props.onSubmit(
      { ...values, selectedCategories: this.state.selectedCategories },
      this.state.image,
      bag
    );
  };

  customValidation = async values => {
    let errors = {};
    let validationSchema = Yup.object().shape({
      name: Yup.string()
        .min(5)
        .required(),
      description: Yup.string()
        .min(20)
        .required()
    });
    try {
      await validationSchema.validate(values, { abortEarly: false });
    } catch (err) {
      errors = err.inner.reduce((accumulator, error) => {
        return { ...accumulator, [error.path]: error.message };
      }, {});
    }
    let { image } = this.state;
    if (!this.props.initialValues.image_key && !image) {
      errors = { ...errors, image: "Please upload an image!" };
    }

    if (Object.keys(errors).length) {
      throw errors;
    }
  };

  render() {
    const { title, submitLabel, initialValues, onClose } = this.props;
    let previewSrc = null;
    let isEdit = false;

    if (initialValues.image_key) {
      isEdit = true;
      previewSrc =
        REACT_APP_AWS_BUCKET_URI + "/portfolio/" + initialValues.image_key;
    } else if (this.state.image) {
      previewSrc = this.state.image.src;
    }
    return (
      <FormContainer onClose={onClose}>
        <FormTitle gutterBottom>{title}</FormTitle>
        <Formik
          onSubmit={this.onSubmit}
          initialValues={initialValues}
          validate={this.customValidation}
        >
          {() => (
            <Form>
              <Grid container spacing={24}>
                <Grid item xs={6}>
                  <FormElement
                    type="text"
                    name="name"
                    label="Artwork Name"
                    component={TextField}
                    errorOnTouch
                  />
                  <FormElement
                    type="text"
                    name="description"
                    label="Artwork Description"
                    component={TextField}
                    errorOnTouch
                  />
                </Grid>
                <Grid item xs={6}>
                  <CheckboxTree
                    onSelect={this.handleTreeSelect}
                    initialCategories={initialValues.categories}
                  />
                </Grid>
              </Grid>
              <FormRow>
                <ImagePreview src={previewSrc} isLoading={false} />
                {!isEdit ? (
                  <ImageUploader
                    withIcon={true}
                    buttonText="Choose images"
                    imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                    maxFileSize={5242880}
                    name="image"
                    appendImage={this.appendImage}
                  />
                ) : null}
                <ErrorMessage name="image" />

                <Button type="submit">{submitLabel}</Button>
              </FormRow>
            </Form>
          )}
        </Formik>
      </FormContainer>
    );
  }
}

APortfolioForm.propTypes = {
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  handleSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  onClose: PropTypes.func
};

APortfolioForm.defaultProps = {
  initialValues: {
    name: "",
    description: ""
  }
};

export default APortfolioForm;
