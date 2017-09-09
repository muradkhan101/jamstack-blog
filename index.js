const express = require('express');
const build = require('./build-scripts/buildHTML');
const contentful = require('./components/contentful/contentfulAPI');
const gulp = require('gulp');
const rename = require('gulp-rename');
const nunjucks = require('gulp-nunjucks-html');

build.buildCategoryPage();
