import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import styled from "styled-components";
import ThemeHoverButton from "../UI/OutlineHoverButton/ThemeHoverButton";
import { withStyles } from "@material-ui/core/styles";
const StyledLink = styled(NavLink)`
  text-decoration: none;
  color: #fff;

  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
`;

const styles = {
  active: {
    fontWeight: "bold",
    textDecoration: "underline"
  }
};

const HorizontalNavigation = props => {
  console.log(props.location.pathname);
  return props.options.map(option => {
    let newOption;
    if (option.onClick) {
      newOption = (
        <ThemeHoverButton key={option.title} onClick={option.onClick}>
          {option.title}
        </ThemeHoverButton>
      );
    } else {
      newOption =
        option.link === props.location.pathname.substr(1) ? (
          <ThemeHoverButton active key={option.title}>
            {option.title}
          </ThemeHoverButton>
        ) : (
          <StyledLink
            to={option.link}
            exact
            activeClassName={props.classes.active}
            key={option.title}
          >
            <ThemeHoverButton>{option.title}</ThemeHoverButton>
          </StyledLink>
        );
    }
    return newOption;
  });
};

export default withStyles(styles)(withRouter(HorizontalNavigation));
