const { transaction, raw } = require("objection");
const knex = require("../db/knex");

// Generate raw suborder query (Another level of restirction of order within a given table)
_generateSubOrder = suborder => {
  let suborder_query = "";
  if (typeof suborder !== "undefined") {
    if (typeof suborder.column === "undefined") {
      throw "Undefined suborder column!";
    }
    if (typeof suborder.value === "undefined") {
      suborder_query = knex.raw("WHERE ?? is null", [suborder.column]);
    } else {
      suborder_query = knex.raw(" WHERE ??=?", [
        suborder.column,
        suborder.value
      ]);
    }
  }
  return suborder_query;
};

injectOrder = async (table, order_column, step = 100000, suborder) => {
  let suborder_query = _generateSubOrder(suborder);
  suborder_query = suborder_query.toString();
  const temp_table = "temp_order_" + table;

  const request = await knex.raw(
    'WITH :temp_table: AS (SELECT (-row_number() OVER (ORDER BY :order_column:))*:step+(SELECT min(:order_column:) FROM :table: WHERE "parent_id"=(SELECT "parent_id" FROM "category" WHERE id=' +
      suborder.value +
      ')) AS "new_order", "id" FROM :table: ' +
      suborder_query +
      ') UPDATE :table: SET :order_column:=:temp_table:."new_order" FROM :temp_table: WHERE :table:."id"=:temp_table:."id"',
    { temp_table, table, suborder_query, order_column, step }
  );
};

// Spread order values around for when pathological reordering patterns emerge
normalizeTable = async (
  table,
  orderfield,
  constraint = undefined,
  step = 100000
) => {
  const temp_table = "temp_order_" + table;

  // Check if constraint queries were included
  if (Array.isArray(constraint)) {
    alterConstraint = constraint[0];
    addConstraint = constraint[1];
  }
  return transaction(knex, async trx => {
    await trx.raw(constraint[0]);
    await trx.raw(
      'WITH ?? AS (SELECT (row_number() OVER (ORDER BY ??)-(SELECT count(*) FROM ??)/2)*? AS "new_order", "id" FROM ??) UPDATE ?? SET ?? = ??."new_order" FROM ?? WHERE ??."id"=??."id";',
      [
        temp_table,
        orderfield,
        table,
        step,
        table,
        table,
        orderfield,
        temp_table,
        temp_table,
        temp_table,
        table
      ]
    );
    await trx.raw(constraint[1]);
  });
};

// Generate the SQL necessary to value-wise push order column (generally to be used on insert, but may have other use-cases)
generateRawPushOrder = (
  table,
  orderColumn = "order",
  suborder,
  step = 100000
) => {
  let rawString = "coalesce((SELECT max(??) + ? FROM ?? ?), 0)";
  let suborder_query = _generateSubOrder(suborder);
  let bindingsArray;
  if (!suborder_query) {
    rawString = "coalesce((SELECT max(??) + ? FROM ??), 0)";
    bindingsArray = [orderColumn, step, table];
  } else {
    bindingsArray = [orderColumn, step, table, suborder_query];
  }
  return raw(rawString, bindingsArray);
};

reorder = async (
  afterId,
  currentId,
  tableModel,
  typeConstraint,
  otherPatches = {}
) => {
  let reordered;
  let andConstraint = "";
  if (typeConstraint) {
    if (typeConstraint.value === null) {
      andConstraint = knex
        .raw(" AND ?? IS NULL", [typeConstraint.column])
        .toString();
      whereConstraint = knex
        .raw(" WHERE ?? IS NULL", [typeConstraint.column])
        .toString();
    } else {
      andConstraint = knex
        .raw(" AND ??=?", [typeConstraint.column, typeConstraint.value])
        .toString();
      whereConstraint = knex
        .raw(" WHERE ??=?", [typeConstraint.column, typeConstraint.value])
        .toString();
    }
  }
  // If afterId wasn't specified simply unshift currentId :
  if (!afterId && typeof currentId === "number") {
    reordered = await tableModel
      .query()
      .patch({
        order: raw(
          'COALESCE((SELECT min("order")-1000 FROM ??),0)',
          tableModel.tableName
        ),
        ...otherPatches
      })
      .where("id", currentId);
  } else {
    reordered = tableModel
      .query()
      .patch({
        order: raw(
          'COALESCE((SELECT (:orderColumn:+(SELECT min(:orderColumn:) FROM :table: WHERE :orderColumn:>(SELECT :orderColumn: FROM :table: WHERE "id"=:afterId' +
            andConstraint +
            ')))/2 FROM :table: WHERE "id"=:afterId), (SELECT max(:orderColumn:)+1000 FROM :table:) ,0)',
          {
            table: tableModel.tableName,
            orderColumn: "order",
            afterId
          }
        ),
        ...otherPatches
      })
      .where("id", currentId);

    // Execute query
    try {
      await reordered.catch(async err => {
        console.log(err);
        // If there was an issue entering, assume the orders need renormalization (to make room between them), so do that and try again
        await normalizeTable(
          tableModel.tableName,
          "order",
          typeConstraint
            ? [
                'ALTER TABLE "' +
                  tableModel.tableName +
                  '" DROP CONSTRAINT "' +
                  typeConstraint.constraintName +
                  '";',
                "ALTER TABLE " +
                  tableModel.tableName +
                  '"	ADD CONSTRAINT "' +
                  typeConstraint.constraintName +
                  '" ' +
                  typeConstraint.constraintDeclaration +
                  ";"
              ]
            : undefined,
          100000,
          { column: typeConstraint.column, value: typeConstraint.value }
        );

        // Now try again
        await reordered.catch(err => {
          return {
            message: "There was a problem with the reorder.",
            error: err
          };
        });
      });
    } catch (err) {
      console.log("An error has occured:", err);
    }
  }
  if (reordered) {
    return { status: true, message: "Reordered succesfully! " };
  } else {
    return { status: false };
  }
};

module.exports = { normalizeTable, injectOrder, generateRawPushOrder, reorder };
