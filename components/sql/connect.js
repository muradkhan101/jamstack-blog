const sql = require('mysql');
const config = require('./config.json');

const connection = sql.createConnection(config.credentials);
const pool = sql.createPool(Object.assign({}, config.credentials, {
  connectionLimit: 10,
  database: "random"
}))

const poolQuery = (pool, f, params) => {
  return new Promise(function(resolve, reject) {
    pool.getConnection((err, connection) => {
      f(connection, params).then((result) => {
        console.log(result);
        connection.release();
        if (err) reject(err);
        resolve({
          code: 200,
          text: result
        })
      }).catch((error) => {
        connection.release();
        console.log(error);
        resolve({
          code: 400,
          text: error
        })
      })
    })
  })
}

const doQuery = (connection, f, params) => {
  // connection.connect();
  return f(connection, params).then((result) => {
    connection.end();
    console.log(result);
    return {
      code: 200,
      text: result
    };
  }).catch((error) => {
    connection.end();
    console.log(error);
    return {
      code: 400,
      text: error
    }
  })
}

module.exports = {
  connection,
  doQuery,
  pool,
  poolQuery
}
