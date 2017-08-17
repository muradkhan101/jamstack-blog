const express = require('express');
const gulp = require('gulp');
const rename = require('gulp-rename');
const nunjucks = require('gulp-nunjucks-html');
const contentful = require('./contentful/contentfulAPI');

// Query for all posts
contentful.client.getEntries({
    content_type: "2wKn6yEnZewu2SCCkus4as",
    include: 3
}).then(function(data) {
    for (let i = 0; i < data.items.length; i++) {
        var post = {};
        post = contentful.extractPostInfo(data.items[0]);
        console.log(post.author);
        gulp.src('./templates/post.njk')
            .pipe(nunjucks({
                searchPaths: ['./templates'],
                locals: post
            }))
            .on('error', console.log)
            .pipe(gulp.dest('./build/'+post.slug+'.html'));
    }
})


// contentfulAPI.getEntry('A96usFSlY4G0W4kwAqswk', function(data){
//     // data.fields.body = markdown.toHTML(data.fields.body);
//     console.log(data);
//     gulp.src('./templates/post.njk')
//         .pipe(nunjucks({
//             searchPaths: ['templates'],
//             locals: data.fields
//         }))
//         .pipe(gulp.dest('./build'));
// })
