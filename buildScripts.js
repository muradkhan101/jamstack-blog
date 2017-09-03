const gulp = require('gulp');
const rename = require('gulp-rename');
const nunjucks = require('gulp-nunjucks-html');
const contentful = require('./contentful/contentfulAPI');
const constants = require('./config/constants')

const addExtras = (object, extras) => {
  let newObject = Object.assign({}, object, )
}

// Query for all posts and build files
exports.buildPostPages = () => {
    contentful.getAllPosts()
        .then(function (data) {
        for (let i = 0; i < data.items.length; i++) {
            var incompletePost = {};
            incompletePost = contentful.extractPostInfo(data.items[i]);
            var post = Object.assign({}, incompletePost, constants)
            gulp.src('./templates/post.njk')
                .pipe(nunjucks({
                    searchPaths: ['./templates'],
                    locals: post
                }))
                .on('error', console.log)
                .pipe(rename(`${post.slug}.html`))
                .pipe(gulp.dest('./build/posts'));
        }
    }).catch(function (err) {
        console.log(err);
    })
}

exports.buildHomePage = () => {
    contentful.getRecentPosts(10)
        .then(function(incompletePosts) {
            var posts = Object.assign({}, incompletePosts, constants);
            gulp.src('./templates/home.njk')
                .pipe(nunjucks({
                    searchPaths: ['./templates'],
                    locals: posts
                }))
                .pipe(rename('home.html'))
                .pipe(gulp.dest('./build'))
        }).catch(function (err){
            console.log(err)
    })
}

exports.buildCategoryPage = () => {
    contentful.getRecentPosts(10)
        .then(function(incompletePosts) {
            var posts = Object.assign({}, incompletePosts, constants);
            gulp.src('./templates/home.njk')
                .pipe(nunjucks({
                    searchPaths: ['./templates'],
                    locals: posts
                }))
                .pipe(rename('home.html'))
                .pipe(gulp.dest('./build'))
        }).catch(function (err){
            console.log(err)
    })
}
