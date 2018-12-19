exports.up = function(knex, Promise) {
  return knex.schema.createTable("artwork", table => {
    table.increments();
    table.string("name").notNullable();
    table.string("description").notNullable();
    table.timestamp("create_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("artwork");
};
