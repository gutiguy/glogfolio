import React from "react";
import styled from "styled-components";
import { Typography, Button } from "@material-ui/core";

const StyledList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const FooterList = props => {
  const { type } = props;
  return (
    <React.Fragment>
      <Typography variant="subheading" color="inherit">
        {type.name}
      </Typography>
      <StyledList>
        {type.lists.map(list => (
          <li key={list.name}>
            <Button
              variant="flat"
              color="inherit"
              size="small"
              href={list.link}
            >
              {list.name}
            </Button>
          </li>
        ))}
      </StyledList>
    </React.Fragment>
  );
};

export default FooterList;
