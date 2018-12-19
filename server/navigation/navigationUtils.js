const { Navigation } = require("./navigationModels");
const { generateRawPushOrder } = require("../services/reorder");

function insertNavigation({ trx, name, shown, type }) {
  return Navigation.query(trx).insert({
    name,
    shown,
    type,
    order: generateRawPushOrder("navigation", "order", undefined, 10000)
  });
}

function editNavigation({ trx, name, shown, id }) {
  return Navigation.query(trx)
    .patch({
      name,
      shown
    })
    .where("id", id);
}

module.exports = { insertNavigation, editNavigation };
