exports.up = function(knex, Promise) {
  return knex.schema.alterTable("artwork", table => {
    table.renameColumn("image_url", "image_key");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable("artwork", table => {
    table.renameColumn("image_key", "image_url");
  });
};
