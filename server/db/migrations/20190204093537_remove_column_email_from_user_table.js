exports.up = function(knex, Promise) {
  return knex.schema.table("user", table => {
    table.dropColumn("email");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("user", table => {
    table
      .string("email")
      .notNullable()
      .unique();
  });
};
