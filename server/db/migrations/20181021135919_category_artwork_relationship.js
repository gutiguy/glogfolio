exports.up = function(knex, Promise) {
  return knex.schema.createTable("artwork_category", table => {
    // Primary Key:
    table.increments("id").primary();
    table
      .integer("artwork_id")
      .references("id")
      .inTable("artwork")
      .notNullable()
      .onDelete("cascade");
    table
      .integer("category_id")
      .references("id")
      .inTable("category")
      .notNullable()
      .onDelete("cascade");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("artwork_category");
};
