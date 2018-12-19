import styled from "styled-components";
import React from "react";
import { Modal } from "@material-ui/core";
import CenterToViewport from "../../UI/CenterToViewport/CenterToViewport";

const InnerContainer = styled.div`
  background-color: #fff;
  padding: 50px;
  min-width: 50vw;
`;

const FormContainer = ({ children, onClose }) => {
  return (
    <Modal open={true} onClose={onClose}>
      <CenterToViewport>
        <InnerContainer>{children}</InnerContainer>
      </CenterToViewport>
    </Modal>
  );
};

export default FormContainer;
