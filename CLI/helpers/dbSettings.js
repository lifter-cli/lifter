var dbSettings = {

  mongoDB: {
    command: 'docker run --name db -d mongo',
    portExposed: 27017,
    defaultTag: 'mongo:latest'
    },

  redis: {
    command: 'docker run --name db -d redis',
    portExposed: 6379,
    defaultTag: 'redis:latest'
    },

  mySQL: {
    // setting MYSQL_ROOT_PASSWORD to 'mysecretpassword', but we can ask a question to specify this
    command: 'docker run --name db -e MYSQL_ROOT_PASSWORD=mysecretpassword -d mysql',
    portExposed: 3306,
    defaultTag: 'mysql:latest'
  },

  postgres: {
    command: 'docker run --name db -d postgres',
    portExposed: 5432,
    defaultTag: 'postgres:latest'
  }

}

module.exports = {
  dbSettings : dbSettings
}