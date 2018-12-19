exports.up = function(knex, Promise) {
  return knex.schema.createTable("page", table => {
    table.increments("id").primary();
    table.string("title", 255);
    table.text("content");
    table.string("perma", 20);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("page");
};
