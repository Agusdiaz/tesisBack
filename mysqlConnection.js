var mysql = require('mysql');

var conMysql = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "tesis2020",
  database: "flamma",
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