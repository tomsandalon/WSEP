const knex = require('knex');
const db_configurations = require('./knexfile');
let connection = undefined
module.exports.connectToDB = () => {
    connection = knex(db_configurations.development)
    exports.db = connection;
    return connection
}
module.exports.isConnectedToDB = () =>
    connection.raw('select 1+1 as result')
        .then(_ => true)
        .catch(_ => false)
module.exports.getDB = () => connection;
exports.getBuilder = () => module.exports.getDB().schema;
const defs = require('./Tables');
const config = [
    defs.purchase_type,
    defs.permission,
    defs.user,
    defs.shop,
    defs.product,
    defs.purchase,
    defs.basket,
    defs.offer,
    defs.offer_not_accepted_by,
    defs.rates,
    defs.available,
    defs.owns,
    defs.manages,
    defs.notification,
    defs.purchase_condition_type,
    defs.purchase_condition,
    defs.purchase_simple_condition,
    defs.purchase_composite_condition,
    defs.purchase_condition_operator,
    defs.purchase_comprised,
    defs.purchase_condition_allowed_in,
    defs.purchase_simple_condition_type_of,
    defs.discount,
    defs.discount_operator,
    defs.discount_allowed_in,
    defs.discount_conditional,
    defs.discount_simple,
    defs.discount_composite,
    defs.discount_comprised_composite,
    defs.discount_comprised_conditional,
    defs.discount_condition_type,
    defs.discount_conditional_type_of,
];
exports.offer_not_accepted_by = defs.offer_not_accepted_by;
exports.config = config;