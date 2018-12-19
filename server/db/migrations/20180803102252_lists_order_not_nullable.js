exports.up = function(knex, Promise) {
  return knex.schema.alterTable("list", table => {
    table
      .bigInteger("order")
      .notNull()
      .alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable("list", table => {
    table
      .integer("order")
      .nullable()
      .alter();
  });
};
