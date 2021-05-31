// Update with your config settings.

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      database: 'wsep',
      user:     'Mark',
      password: 'FuckUniv2021',
      charset: 'utf8'
    },
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
