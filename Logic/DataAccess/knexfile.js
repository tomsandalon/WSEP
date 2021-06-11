// Update with your config settings.
const {getDB_Client, getDB_Connection} = require('../Config')
module.exports = {
  development: {
    client: getDB_Client(),
    connection: getDB_Connection(),
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  // development: {
  //   client: 'mysql',
  //   connection: {
  //     host: '127.0.0.1',
  //     database: 'my_db',
  //     user:     'Mark',
  //     password: null
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // },
};
