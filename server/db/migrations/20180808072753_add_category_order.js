exports.up = function(knex, Promise) {
  return knex.schema.alterTable("category", category => {
    category.bigInteger("order");
    category.unique(["order", "parent_id"]);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable("category", category => {
    category.dropUnique(["order", "parent_id"]);
    category.dropColumn("order");
  });
};
