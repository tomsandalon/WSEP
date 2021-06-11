// Update with your config settings.
const {client, connection} = require('../Config')
module.exports = {
  development: {
    client: client,
    connection: connection,
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
