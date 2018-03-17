const build = require('./build-scripts/buildHTML');
const random = require('./components/sql/sql-random')
const connect = require('./components/sql/connect')

connect.doQuery(connect.connection, random.clearTable).then(() => {
  build.buildPostPages();
  build.buildHomePage();
  build.buildCategoryPage();
}).catch(err => console.log(err));
