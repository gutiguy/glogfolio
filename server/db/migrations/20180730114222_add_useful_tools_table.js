exports.up = function(knex, Promise) {
  return knex.schema.createTable("useful_tool", table => {
    // Primary Key:
    table.increments();
    table.integer("order");
    table.string("name").notNullable();
    table.string("link").notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("useful_tool");
};
