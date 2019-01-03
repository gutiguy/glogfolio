exports.up = function(knex, Promise) {
  return knex.schema.alterTable("post", table => {
    table
      .dateTime("updated_at")
      .defaultTo(null)
      .alter();
    table.renameColumn("updated_at", "posted_at");
    table.dropColumn("draft");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable("post", table => {
    table
      .dateTime("posted_at")
      .defaultTo(knex.fn.now())
      .alter();
    table.renameColumn("posted_at", "updated_at");
    table.boolean("draft").defaultTo(true);
  });
};
