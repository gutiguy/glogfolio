import React, { Component } from "react";
import PropTypes from "prop-types";

import { Button } from "@material-ui/core";

import { Formik, Field, ErrorMessage } from "formik";
import { TextField } from "material-ui-formik-components";
import { FormContainer, FormTitle, FormElement, FormRow, Form } from "../Form";
import ImageUploader, { ImagePreview } from "../ImageUploader";
import * as Yup from "yup";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const CROP_RATIO = 2100 / 900;

class ACarouselForm extends Component {
  state = {
    image: null,
    crop: { aspect: CROP_RATIO },
    cropData: null
  };

  appendImage = image => {
    this.setState({
      image,
      cropData: { x: 0, y: 0, width: image.width, height: image.height }
    });
  };

  onSubmit = (values, bag) => {
    this.props.onSubmit(
      { ...values, image: this.state.image, cropData: this.state.cropData },
      bag
    );
  };

  customValidation = async values => {
    let errors = {};
    let validationSchema = Yup.object().shape({
      title: Yup.string()
        .min(5)
        .required(),
      description: Yup.string()
        .min(20)
        .required(),
      url: Yup.string()
        .max(500)
        .required()
    });
    try {
      await validationSchema.validate(values, { abortEarly: false });
    } catch (err) {
      errors = err.inner.reduce((accumulator, error) => {
        return { ...accumulator, [error.path]: error.message };
      }, {});
    }
    let { image, crop } = this.state;
    if (!this.props.initialValues.image_key) {
      if (!image) {
        errors = { ...errors, image: "Please upload an image!" };
      } else if (
        !crop.width &&
        (image && image.width / image.height !== CROP_RATIO)
      ) {
        errors = {
          ...errors,
          image:
            "Please drag mouse to crop the image to the correct aspect ratio"
        };
      }
    }

    if (Object.keys(errors).length) {
      throw errors;
    }
  };

  render() {
    const { title, submitLabel, initialValues, onClose } = this.props;
    let { crop } = this.state;
    let imageField;
    if (initialValues.image_key) {
      imageField = () => (
        <ImagePreview
          src={
            "***REMOVED***/carousel/" +
            initialValues.image_key
          }
          isLoading={false}
        />
      );
    } else {
      imageField = setFieldTouched => (
        <FormRow>
          {this.state.image ? (
            <ReactCrop
              src={this.state.image.src}
              crop={crop}
              onChange={(crop, pixelCrop) => {
                this.setState({ crop, cropData: pixelCrop });
              }}
            />
          ) : (
            ""
          )}

          <Field
            component={ImageUploader}
            withIcon={true}
            buttonText="Choose images"
            imgExtension={[".jpg", ".gif", ".png", ".gif"]}
            maxFileSize={5242880}
            name="image"
            appendImage={image => {
              setFieldTouched("image");
              this.appendImage(image);
            }}
          />
          <ErrorMessage name="image" />
        </FormRow>
      );
    }

    return (
      <FormContainer onClose={onClose}>
        <FormTitle gutterBottom>{title}</FormTitle>
        <Formik
          onSubmit={this.onSubmit}
          initialValues={initialValues}
          validate={this.customValidation}
        >
          {({ setFieldTouched }) => {
            return (
              <Form>
                <FormElement
                  type="text"
                  name="title"
                  label="Item Name"
                  component={TextField}
                  errorOnTouch
                />
                <FormElement
                  type="text"
                  name="description"
                  multiline
                  rows="8"
                  margin="normal"
                  variant="outlined"
                  label="Item Text"
                  component={TextField}
                  errorOnTouch
                />
                <FormElement
                  type="text"
                  name="url"
                  label="Url"
                  component={TextField}
                  errorOnTouch
                />
                {imageField(setFieldTouched)}
                <FormRow>
                  <Button type="submit">{submitLabel}</Button>
                </FormRow>
              </Form>
            );
          }}
        </Formik>
      </FormContainer>
    );
  }
}

ACarouselForm.propTypes = {
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  handleSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  onClose: PropTypes.func
};

ACarouselForm.defaultProps = {
  initialValues: {
    title: "",
    description: "",
    image: null
  },
  submitLabel: "Submit"
};

export default ACarouselForm;
