const express = require('express');
const build = require('./buildScripts');
const contentful = require('./contentful/contentfulAPI');

build.buildHomePage();
build.buildPostPages();
