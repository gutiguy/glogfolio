exports.up = function(knex, Promise) {
  return knex.schema
    .createTable("user", user => {
      user.increments();
      user
        .string("name")
        .notNullable()
        .unique();
      user.string("password", 200).notNullable();
      user
        .string("email")
        .notNullable()
        .unique();
    })
    .raw(
      'alter table "user" add constraint "pass_length" check (length("password") >= 8)'
    )
    .on("query", data => {
      console.log(data);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("user");
};
