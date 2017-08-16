const express = require('express');
const gulp = require('gulp');
const nunjucks = require('gulp-nunjucks-html');
const markdown = require('markdown');
const contentfulAPI = require('./contentful/contentfulAPI');

    contentfulAPI.getEntry('A96usFSlY4G0W4kwAqswk', function(data){
        gulp.src('./templates/post.njk')
            .pipe(nunjucks({
                searchPaths: ['templates'],
                locals: data.fields
            }))
            .pipe(gulp.dest('./build'));
    })
