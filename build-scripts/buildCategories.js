const MainCategoryContainer = require('../components/CategoryDisplay/MainCategoryContainer');
const actions = require('../components/redux/reducers/actions');
const reactDOM = require('react-dom/server');
const React = require('react');
const redux = require('redux');
const Provider = require('react-redux').Provider;
const thunk = require('redux-thunk').default;
const jsdom = require('jsdom').JSDOM;
const fs = require('fs');

const gulp = require('gulp');
const nunjucks = require('gulp-nunjucks-html');
const rename = require('gulp-rename');
const constants = require('../config/constants')

const buildCategory = () => {
  const store = redux.createStore(actions.handleAction, redux.applyMiddleware(thunk));
  store.dispatch(actions.fetchCategories()).then(categories => store.dispatch(actions.fetchUnloadedPosts(categories))).then(() => {
    const html = reactDOM.renderToString(React.createElement(
      Provider,
      { store: store },
      React.createElement(MainCategoryContainer, null)
    ));
    const preloadedState = store.getState();

    gulp.src('./templates/categories.njk')
        .pipe(nunjucks({
            searchPaths: ['./templates'],
            locals: Object.assign(constants, {isPost: true})
        }))
        .on('error', console.log)
        .pipe(rename(`categories.html`))
        .pipe(gulp.dest('./'))
        .on('end', function() {
          jsdom.fromFile(`./categories.html`).then(dom => {
            return createPrerenderHtml(dom, html, preloadedState);
          }).then((domString) => {
            fs.writeFileSync('./build/categories.html', domString);
            fs.unlinkSync('./categories.html');
            return 1;
          });
        })
  });
  return 1;
};

const createPrerenderHtml = (dom, html, preloadedState) => {
  let document = dom.window.document;
  document.getElementById('react-container').appendChild(jsdom.fragment(html));
  document.querySelector('body').appendChild(jsdom.fragment(`<script>
      window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
    </script>
    <script src='../resources/js/categories.js'></script>`));
  dom.window.document = document;
  return dom.serialize();
};

module.exports = {
  buildCategory
};
