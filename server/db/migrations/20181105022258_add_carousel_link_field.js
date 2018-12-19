exports.up = function(knex, Promise) {
  return knex.schema.alterTable("carousel", table => {
    table.string("url", 500);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable("carousel", table => {
    table.dropColumn("url");
  });
};
