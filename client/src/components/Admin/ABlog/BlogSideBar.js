import React, { Component } from "react";
import { Paper } from "@material-ui/core";
import styled from "styled-components";
import TagsPanel from "./TagsPanel";
import DatesPanel from "./DatesPanel";
const MarginPaper = styled(Paper)`
  margin-top: 1rem;
  padding: 0.5rem;
`;

export default class BlogSideBar extends Component {
  render() {
    const {
      tags,
      selectedTags,
      onAddTag,
      onDeleteTag,
      selectedMonth,
      selectedYear,
      switchYear,
      switchMonth
    } = this.props;
    return (
      <MarginPaper>
        <DatesPanel
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          switchYear={switchYear}
          switchMonth={switchMonth}
        />
        <TagsPanel
          tags={tags}
          selectedTags={selectedTags}
          onAdd={onAddTag}
          onDelete={onDeleteTag}
        />
      </MarginPaper>
    );
  }
}
