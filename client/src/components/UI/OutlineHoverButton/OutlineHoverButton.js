import React from "react";
import styled from "styled-components";

const StyledLink = styled.span`
  position: relative;
  overflow: hidden;
  display: inline-block;
  padding: 0.7rem;
  background: transparent;
  text-align: center;
  letter-spacing: 2px;
  text-indent: 2px;

  span {
    background: currentColor;
    transition: 0.2s;
    position: absolute;
  }

  span:nth-child(1),
  span:nth-child(3) {
    height: 2px;
    width: 100%;
  }

  span:nth-child(2),
  span:nth-child(4) {
    height: 100%;
    width: 2px;
  }

  span:nth-child(1) {
    top: 0;
    left: ${props => (props.active ? "0" : "-101%")};
  }
  span:nth-child(2) {
    top: ${props => (props.active ? "0" : "-101%")};
    right: 0;
  }
  span:nth-child(3) {
    bottom: 0;
    right: ${props => (props.active ? "0" : "-101%")};
  }
  span:nth-child(4) {
    top: ${props => (props.active ? "0" : "101%")};
    left: 0;
  }

  :hover span:nth-child(1) {
    left: 0;
    transition-delay: 0;
  }

  :hover span:nth-child(2) {
    top: 0;
    right: 0;
    transition-delay: 0.2s;
  }

  :hover span:nth-child(3) {
    right: 0;
    bottom: 0;
    transition-delay: 0.4s;
  }

  :hover span:nth-child(4) {
    top: 0;
    transition-delay: 0.6s;
  }

  :hover {
    cursor: pointer;
  }
`;

const OutlineHoverButton = props => {
  let spans = [];
  for (let i = 0; i < 4; i++) {
    spans.push(<span key={i} />);
  }
  return (
    <StyledLink {...props}>
      {props.children}
      {spans}
    </StyledLink>
  );
};

export default OutlineHoverButton;
