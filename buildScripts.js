const gulp = require('gulp');
const rename = require('gulp-rename');
const nunjucks = require('gulp-nunjucks-html');
const contentful = require('./contentful/contentfulAPI');

//Constants for website build
const baseURL = 'blog.khanmurad.com';

const footer = {
    copyright: `Copyright &copy; ${(new Date()).getFullYear()} Murad Khan - All Rights Reserved`,
    summary: 'This blog was created not only as a new pet project for me to practice new development techniques, but also ' +
             'as a way for me to teach others about a variety of topics. My main focus will be front-end development, ' +
             'since that is my what I spend a majority of my time on. However, I will post about other topics I am learning, ' +
             'such as machine learning, back-end development, AWS, and others. I hope you gain something useful and the posts are ' +
             'as helpful for you to read as they are for me to write!'
};

const navigation = [
    {
        href: baseURL,
        title: 'Home'
    },
    {
        href: `${baseURL}/all`,
        title: 'All Posts'
    },
    {
        href: `${baseURL}/categories`,
        title: 'Categories'
    },

    {
        href: `${baseURL}/random`,
        title: 'Random'
    }
];

// Query for all posts and build files
exports.buildPostPages = () => {
    contentful.getAllPosts()
        .then(function (data) {
        for (let i = 0; i < data.items.length; i++) {
            var post = {};
            post = contentful.extractPostInfo(data.items[i]);
            post.navigation = navigation;
            post.footer = footer;
            gulp.src('./templates/post.njk')
                .pipe(nunjucks({
                    searchPaths: ['./templates'],
                    locals: post
                }))
                .on('error', console.log)
                .pipe(rename(`${post.slug}.html`))
                .pipe(gulp.dest('./build'));
        }
    }).catch(function (err) {
        console.log(err);
    })
}

exports.buildHomePage = () => {
    contentful.getRecentPosts(10)
        .then(function(posts) {
            posts.navigation = navigation;
            posts.footer = footer;
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
        .then(function(posts) {
            posts.navigation = navigation;
            posts.footer = footer;
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
