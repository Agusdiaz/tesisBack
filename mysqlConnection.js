var mysql = require('mysql');

var conMysql = mysql.createConnection({
  host: process.env.HOST || "localhost",
  user: process.env.USER || "root",
  password: process.env.PASS || "tesis2020",
  database: process.env.DB || "flamma",
  port: process.env.PORT || null,
  multipleStatements: true,
  //insecureAuth : true,
});

conMysql.connect((err) => {
    if(err){
      console.log('Error connecting to DB');
      console.log(err)
      return;
    }
    console.log('Connection to DB established');
  });
  
  /*conMysql.end((err) => {
    // The connection is terminated gracefully
    // Ensures all remaining queries are executed
    // Then sends a quit packet to the MySQL server.
  });*/

module.exports = conMysql;