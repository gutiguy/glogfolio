exports.up = function(knex, Promise) {
  return knex.schema
    .createTable("post", post => {
      post.increments("id").primary();
      post.boolean("draft").defaultTo(true);
      post.string("title", 255);
      post.text("content");
      post.dateTime("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("tag", tag => {
      tag.increments("id").primary();
      tag.string("name", 100);
    })
    .createTable("post_tag", postTag => {
      postTag.increments("id").primary();
      postTag.bigInteger("tag_id").notNullable();
      postTag
        .foreign("tag_id")
        .references("id")
        .inTable("tag")
        .onDelete("CASCADE");
      postTag.bigInteger("post_id").notNullable();
      postTag
        .foreign("post_id")
        .references("id")
        .inTable("post")
        .onDelete("CASCADE");
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists("post_tag")
    .dropTableIfExists("post")
    .dropTableIfExists("tag");
};
