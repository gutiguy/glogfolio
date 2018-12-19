exports.up = function(knex, Promise) {
  return knex.schema
    .createTable("navigation", table => {
      table.specificType("id", "serial");
      table.string("name", 60);
      table.enu("type", ["E", "P"]).notNullable();
      table.primary(["type", "id"]);
      table
        .bigInteger("order")
        .notNullable()
        .unique();
      table.boolean("shown");
    })
    .createTable("navigation_external", table => {
      table.increments("id").primary();
      table.text("link");
      table
        .enu("type", ["E"])
        .defaultTo("E")
        .notNullable();
      table.integer("navigation_id");
      table
        .foreign(["type", "navigation_id"])
        .references(["type", "id"])
        .inTable("navigation")
        .onDelete("CASCADE");
    })
    .createTable("navigation_page", table => {
      table.increments("id").primary();
      table
        .enu("type", ["P"])
        .defaultTo("P")
        .notNullable();
      table
        .integer("page_id")
        .references("id")
        .inTable("page")
        .onDelete("CASCADE");
      table.integer("navigation_id");
      table
        .foreign(["type", "navigation_id"])
        .references(["type", "id"])
        .inTable("navigation")
        .onDelete("CASCADE");
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists("navigation_external")
    .dropTableIfExists("navigation_page")
    .dropTableIfExists("navigation");
};
