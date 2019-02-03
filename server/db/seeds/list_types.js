exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("list_type")
    .del()
    .then(() => {
      // Inserts seed entries
      return knex("list_type").insert([
        { type: "Useful Tools" },
        { type: "Artists I Follow" }
      ]);
    });
};
