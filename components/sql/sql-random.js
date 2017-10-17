const constants = {
  db: 'random',
  mainTable:  'SLUGS'
}

const clearTable = (connection) => {
  console.log("Clear starting");
  connection.changeUser({database: constants.db})
  return new Promise(function(resolve, reject) {
    connection.query(
      `DELETE FROM ${constants.mainTable} WHERE true;`,
      (error, results, fields) => {
        if (error) {
          reject(error);
        }
        console.log(`${constants.mainTable} cleared`)
        resolve(`${constants.mainTable} cleared`);
      }
    )
  }).then( () => {
    connection.query(
      `ALTER TABLE ${constants.mainTable} AUTO_INCREMENT = 1;`,
      (error, results) => {
        if (error) { throw (error); }
        console.log(`AUTO_INCREMENT reset for ${constants.mainTable}`)
        return `AUTO_INCREMENT reset for ${constants.mainTable}`;
      }
    )
    return `AUTO_INCREMENT reset for ${constants.mainTable}`;
  })
}

const addPost = (connection, slug) => {
  return new Promise(function(resolve, reject) {
    connection.query(
      `INSERT INTO ${constants.mainTable} (SLUG)
       VALUES (?);`,
       slug, (error, results) => {
         if (error) reject(error);
         resolve(`${slug} added with id: ${results.insertId}`)
       }
    )
    return `${slug} added`;
  })
}

const getRandomPost = (connection) => {
  return new Promise( function(resolve, reject) {
    connection.query(
      `SELECT * FROM ${constants.mainTable};`,
      (error, results) => {
        if (error) reject(error);
        resolve(getSlug(connection, randomIndex(results.length+1, 1)))
      }
    )
  })
}

const getSlug = (connection, id) => {
  return new Promise(function(resolve, reject) {
    connection.query(
      `SELECT * FROM ${constants.mainTable}
       WHERE ID = ?;`,
       id, (error, results) => {
         if (error) throw(error);
         console.log(`Found ${slug}`)
         resolve(results[0].SLUG)
       }
    )
  })
}

function randomIndex(max, min=0) {
  return Math.floor((Math.random() * (max - min) + min))
}

module.exports = {
  getRandomPost,
  addPost,
  clearTable
}
