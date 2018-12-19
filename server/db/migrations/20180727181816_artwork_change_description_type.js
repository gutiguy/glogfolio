exports.up = function(knex) {
  return knex.schema.alterTable("artwork", table => {
    table.text("description").alter();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable("artwork", table => {
    table.string("description").alter();
  });
};
