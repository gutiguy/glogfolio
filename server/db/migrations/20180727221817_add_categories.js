exports.up = function(knex, Promise) {
  return knex.schema.createTable("category", category => {
    // Primary Key:
    category.increments();
    // Foreign Key:
    category
      .integer("parent_id")
      .index()
      .references("id")
      .inTable("category");
    category.string("name").notNullable();
    category.string("description").notNullable();
    category.string("group_name");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("category");
};
