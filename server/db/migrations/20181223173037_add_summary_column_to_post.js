exports.up = function(knex, Promise) {
  return knex.schema.alterTable("post", table => table.string("summary", 500));
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable("post", table => table.dropColumn("summary"));
};
