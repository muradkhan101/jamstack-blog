const express = require('express');
const build = require('./buildScripts');

build.buildHomePage();
build.buildPostPages();

