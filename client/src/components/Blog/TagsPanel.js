import React from "react";
import { Typography, Button } from "@material-ui/core";
export default function TagsPanel({ tags, selectedTags, onAdd, onRemove }) {
  return (
    <div>
      <Typography variant="subheading">Tags</Typography>
      <Button
        variant={selectedTags.length ? "text" : "contained"}
        onClick={() => {
          selectedTags.forEach(tag => {
            onRemove(tag);
          });
        }}
      >
        All
      </Button>
      {tags.map(tag => (
        <Button
          key={tag.id}
          onClick={() =>
            !selectedTags.includes(tag.id) ? onAdd(tag.id) : onRemove(tag.id)
          }
          variant={selectedTags.includes(tag.id) ? "contained" : "text"}
        >
          {tag.name}
        </Button>
      ))}
    </div>
  );
}

TagsPanel.defaultProps = {
  tags: []
};
