exports.up = function(knex, Promise) {
  return knex.schema.table("artwork", table => {
    table.renameColumn("create_at", "created_at");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("artwork", table => {
    table.renameColumn("created_at", "create_at");
  });
};
