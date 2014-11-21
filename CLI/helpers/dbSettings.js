var dbSettings = {

  mongo: {
    command: 'docker run --name db -d mongo',
    portExposed: 27017
    },

  redis: {
    command: 'docker run --name db -d redis',
    portExposed: 6379
    },

  mysql: {
    // setting MYSQL_ROOT_PASSWORD to 'mysecretpassword', but we can ask a question to specify this
    command: 'docker run --name db -e MYSQL_ROOT_PASSWORD=mysecretpassword -d mysql',
    portExposed: 3306
  },

  postgres: {
    command: 'docker run --name db -d postgres',
    portExposed: 5432
  }

}

module.exports = {
  dbSettings : dbSettings
}