exports.up = function(knex, Promise) {
  return knex.schema.createTable("carousel", carousel => {
    // Primary Key:
    carousel.increments();
    carousel.string("title", 200).notNullable();
    carousel.text("description").notNullable();
    carousel.string("image_key").notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("carousel");
};
