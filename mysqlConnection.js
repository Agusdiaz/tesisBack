var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "tesis2020",
  database: "flamma",
  //insecureAuth : true,
});

con.connect((err) => {
    if(err){
      console.log('Error connecting to Db');
      console.log(err)
      return;
    }
    console.log('Connection established');
  });
  
  /*con.end((err) => {
    // The connection is terminated gracefully
    // Ensures all remaining queries are executed
    // Then sends a quit packet to the MySQL server.
  });*/

module.exports = con;