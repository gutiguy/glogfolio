exports.up = function(knex, Promise) {
  return knex.schema.alterTable("carousel", carousel => {
    carousel.bigInteger("order");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable("carousel", carousel => {
    carousel.dropColumn("order");
  });
};
