require("dotenv").config()

const {
  DATABASE_NAME,
  DATABASE_USER_NAME,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_DIALECT,
  DB_PORT
} =  process.env

module.exports= {
  development: {
    username: DATABASE_USER_NAME,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    host: DATABASE_HOST,
    dialect: DATABASE_DIALECT
  },
  production: {
    username: DATABASE_USER_NAME,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    host: DATABASE_HOST,
    dialect: DATABASE_DIALECT,
    port:DB_PORT
  }
}
