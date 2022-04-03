const mysql = require('mysql-await');

const {
  SERVER, USER, DATABASE, PASSWORD,
} = require('./env');

const config = {
  host: SERVER,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
};
const connection = mysql.createConnection(config); 
connection.connect((err) => {
  if (err) {
    console.log(`error connecting:${err.stack}`);
  }
  console.log('connected successfully to DB.');
});

module.exports = {
  connection: mysql.createConnection(config),
};
