exports.up = function(knex, Promise) {
  return knex.schema.alterTable("page", table => {
    table.boolean("draft").defaultTo(true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable("page", table => {
    table.dropColumn("draft");
  });
};
