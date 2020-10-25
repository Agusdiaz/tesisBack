var mysql = require('mysql');

var conMysql = mysql.createConnection({
  host: process.env.REACT_APP_HOST || "172.20.0.17",
  user: process.env.REACT_APP_USER || "tesis",
  password: process.env.REACT_APP_PASS || "flammaAPP888",
  database: process.env.REACT_APP_DB || "flamma",
  port: process.env.REACT_APP_DB_PORT || "8818",
  multipleStatements: true,
});

conMysql.connect((err) => {
  if (err) {
    console.log('Error connecting to DB');
    console.log(err)
    return;
  }
  console.log('Connection to DB established');
});

module.exports = conMysql;
