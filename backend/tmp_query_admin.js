const mysql = require('mysql2');
const db = mysql.createConnection({host:'localhost', user:'root', password:'root123', database:'school_management'});
db.query('SELECT id,email,password FROM admin', (err, results) => {
  if (err) {
    console.error('ERR', err.message);
    process.exit(1);
  }
  console.log(JSON.stringify(results, null, 2));
  db.end();
});
