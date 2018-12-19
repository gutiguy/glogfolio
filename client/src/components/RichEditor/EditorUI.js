import styled from "styled-components";
import React from "react";

export const Button = styled("span")`
  cursor: pointer;
  color: ${props =>
    props.reversed
      ? props.active
        ? "white"
        : "#aaa"
      : props.active
        ? "black"
        : "#ccc"};
`;

export const Menu = styled("div")`
  & > * {
    display: inline-block;
  }
  & > * + * {
    margin-left: 15px;
  }
`;

export const Toolbar = styled(Menu)`
  width: 100%;
  padding: 1px 18px 17px;
  margin: 0 -20px;
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;
`;

/**
 * Define our code components.
 *
 * @param {Object} props
 * @return {Element}
 */

export function CodeBlockLine(props) {
  return <code {...props.attributes}>{props.children}</code>;
}
