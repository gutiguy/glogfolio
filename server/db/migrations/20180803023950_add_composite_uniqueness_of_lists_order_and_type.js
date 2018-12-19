exports.up = function(knex, Promise) {
  return knex.schema.alterTable("list", table =>
    table.unique(["order", "list_type_id"])
  );
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable("list", table =>
    table.dropUnique(["order", "list_type_id"])
  );
};
