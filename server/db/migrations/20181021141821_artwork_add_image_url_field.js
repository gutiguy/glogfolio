exports.up = function(knex, Promise) {
  return knex.schema.alterTable("artwork", table => {
    table.string("image_url", 10000);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable("artwork", table => {
    table.dropColumn("image_url");
  });
};
