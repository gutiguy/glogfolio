exports.up = function(knex, Promise) {
  return knex.schema
    .renameTable("useful_tool", "list")
    .createTable("list_type", table => {
      table.increments();
      table.string("type", 200);
    })
    .alterTable("list", table => {
      table.integer("list_type_id").references("list_type.id");
      table.unique(["name", "link"]);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .renameTable("list", "useful_tool")
    .alterTable("useful_tool", table => table.dropColumn("list_type_id"))
    .dropTableIfExists("list_type");
};
