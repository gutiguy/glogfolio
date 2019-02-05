import React from "react";
import { ClickAwayListener } from "@material-ui/core";
import styled from "styled-components";
import CenterToViewport from "../UI/CenterToViewport/CenterToViewport";
import { NavLink } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

const styles = () => ({
  root: {
    zIndex: "1"
  },
  active: {
    fontWeight: "bold"
  }
});

const Menu = styled.ul`
  position: relative;
  list-style-type: none;
  text-align: center;
  padding: 0;
  li {
    margin-bottom: 2rem;
  }
`;

const StyledLink = styled(NavLink)`
  text-decoration: none;
  color: #fff;
  text-transform: uppercase;
  transition: all 0.2s ease-in-out;
  font-size: 3rem;
  :hover {
    font-size: 3.5rem;
  }
`;

const VerticalMenu = props => {
  let options = props.navigationOptions.map(option => {
    return (
      <li key={option.order}>
        <StyledLink
          to={option.link}
          onClick={props.handleClickAway()}
          exact
          activeClassName={props.classes.active}
        >
          {option.title}
        </StyledLink>
      </li>
    );
  });
  return (
    <ClickAwayListener onClickAway={props.handleClickAway()}>
      <CenterToViewport className={props.classes.root}>
        <Menu>{options}</Menu>
      </CenterToViewport>
    </ClickAwayListener>
  );
};

export default withStyles(styles)(VerticalMenu);
