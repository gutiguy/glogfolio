const Categories = [
  {
    name: "Artwork",
    description: "none",
    group_name: "All Artwork"
  },
  {
    name: "Mediums",
    description: "none",
    group_name: "All Mediums",
    parent_name: "Artwork"
  }
];

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("category")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("category").insert(
        Categories.map(category => {
          return {
            name: category.name,
            description: category.description,
            group_name: category.group_name
          };
        })
      );
    });
};
