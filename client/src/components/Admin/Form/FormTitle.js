import React from "react";
import styled from "styled-components";
import { Typography } from "@material-ui/core";

const InnerFormTitle = styled(Typography)`
  margin: 25px auto;
  text-align: center;
`;

const FormTitle = ({ children }) => {
  return <InnerFormTitle variant="headline">{children}</InnerFormTitle>;
};

export default FormTitle;
