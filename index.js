const express = require('express');
const build = require('./buildScripts');
const contentful = require('./contentful/contentfulAPI');
const gulp = require('gulp');
const rename = require('gulp-rename');
const nunjucks = require('gulp-nunjucks-html');

// build.buildHomePage();
// build.buildPostPages();
let postinfo = {
  "sys": {
    "space": {
      "sys": {
        "type": "Link",
        "linkType": "Space",
        "id": "6p3ut94kprf7"
      }
    },
    "type": "Entry",
    "id": "2hFo3rbmZ6U64WaeGusSK2",
    "contentType": {
      "sys": {
        "type": "Link",
        "linkType": "ContentType",
        "id": "2wKn6yEnZewu2SCCkus4as"
      }
    },
    "revision": 0,
    "createdAt": "2017-08-26T23:38:49.827Z",
    "updatedAt": "2017-08-27T18:49:43.383Z",
    "locale": "en-US"
  },
  "fields": {
    "title": "Server-side Rendering With React/Redux",
    "slug": "server-side-rendering-with-react-redux",
    "author": [
      {
        "sys": {
          "type": "Link",
          "linkType": "Entry",
          "id": "zfD288liLYmI0CMGWmskK"
        }
      }
    ],
    "body": "In this post, I'll go through creating a Node app that queries the [Contentful](https://www.contentful.com/) API and uses the response data to pre-render a page server-side before sending the HTML off to the client. This is useful since it improves the preceived load time, creating a better User Experience and allows you to use an API to create a page without giving everyone access to your API keys. Our end product will be a webpage for a blog that displays all the blog posts and allows us to filter by category. If the end product isn't something you need, you can still read through to learn a lot about using asynchronous programming with Redux and connecting it to an instance of React.\nWe will use [Express](https://expressjs.com/) to host our server, [React](https://facebook.github.io/react/) to build our components, and [Redux](http://redux.js.org/) to manage our Component state. \n### Getting Started\nTo start off, you will need to have Node installed. If you don't, you can find a guide to install it [here](https://nodejs.org/en/download/package-manager/).\n\nNext, we'll install [babel-cli](https://babeljs.io/docs/usage/cli/) and [browserify](http://browserify.org/). To install babel and browserify, input the following commands from the terminal.\n<pre><code>\nnpm install --global babel-cli\nnpm install --global browserify\n</code></pre>\nWe'll use babel to compile the jsx files into regular old js files and browserify to compile a js file for the browser by explicitly importing the actual module code from the `require('module')` statements into one big file.\n\nHead over to my [Github repo](https://github.com/muradkhan101/miniature-memory) for this project and download the package.json file and place it in your project directory. Run `npm install` from the terminal and the necessary node dependencies will be automatically installed. You can also view the final files if you would like while you are there.\n\nOne last thing you can do, if you want follow along and create the Categories page yourself, is sign-up for a Contentful account. It's free to sign-up and gives you more than enough usage in the free tier to use on your personal site (I use it for this blog). If you do sign-up, choose the Blog example they provide to have a similar data structure to the one I will be using.\n### Creating the First Component\nThe features we want for this categories page are:\n* To display all the posts from the blog\n* To hide posts from categories of our choosing\n* To display the title and excerpt of each blog post\n* To link to the actual blog post\n\nWe'll start building the components from the bottom-up, starting with a presentational componenent for an individual post. We want the Post component to display the title, excerpt, and link to the actual post, so we will assume we will have this data available in the props for now (we'll actually pass it in later when we make the parent components).\n\n\n<div class='file-name'>Post.jsx</div>\n<pre><code>\n<span class='key'>var</span> <span class='class'>Post</span> = (props) => {\n   &lt;a className=<span class='string'>\"post-link\"</span> href={<span class='string'>&#96;post/${<span class='var'>props.data.url</span>}&#96;</span>}>\n      &lt;div className=<span class='string'>'post-title'</string>>\n         &lt;h3>{<span class='var'>props.data.title</span>}&lt;/h3>\n      &lt;/div>\n      &lt;div className=<span class='string'>'post-excerpt'</span>>\n         &lt;p>{<span class='var'>props.data.summary</span>}&lt;/p>\n      &lt;/div>\n  &lt;/a>\n}\n\n<span class='obj'>module.exports</span> = <span class='var'>Post</span>;\n</code></pre>\nNow we have a reusable component to display some information about our post that will work anywhere, as long as it receives information about post title, excerpt, and URL.\nNext let's make a component that will hold data for each Post component. Keep in mind, that we are separating the Posts by category so this component will need something to hide the Posts if the user filters out this category.\n\n\n<div class='file-name'>SingleCategoryContainer.jsx</div>\n<pre><code>\n<span class='key'>class</span> <span class='class'>SingleCategoryContainer</span> <span class='key'>extends</span> React.Component {\n   <span class='function'>constructor</span>(<span class='var'>props</span>) {\n      <span class='function'>super</span>(<span class='var'>props</span>);\n   }\n   <span class='function'>getVisibility</span>() {\n       return (this.props.visible ? {display: <span class='string'>'inline-block'</span>} : {display: <span class='string'>'none'</span>})\n    }\n   render() {\n    &lt;div className={<span class='string'>&#96;${<span class='var'>this.props.category</span>}-post-container&#96;</span>} style={<span class='function'>this.getVisibility()</span>}>\n      {this.props.posts.map((<span class='var'>e</span>, <span class='var'>i</span>) => {\n         return &lt;<span class='class'>Post</span> key={<span class='var'>i</span>} data={<span class='var'>e</span>} />\n       })}\n    &lt;/div>\n   }\n}\n<span class='obj'>module.exports</span> = <span class='var'>SingleCategoryContainer</span>;\n\n</code></pre>\nThis component receives two props: visible, a boolean indicating whether or not the Category should be displayed, and posts, an array containing data for all the Posts in the Category. ",
    "category": [
      {
        "sys": {
          "type": "Link",
          "linkType": "Entry",
          "id": "1mdJ1HU37CGamQsagusAOc"
        }
      }
    ],
    "tags": [
      "Web Development",
      "front-end",
      "back-end",
      "react",
      "redux",
      "node"
    ],
    "date": "2017-08-30",
    "comments": true,
    "isPost": true
  }
}
var buildPostPages = () => {

    post = contentful.extractPostInfo(postinfo)

    gulp.src('./templates/post.njk')
        .pipe(nunjucks({
            searchPaths: ['./templates'],
            locals: post
        }))
        .on('error', console.log)
        .pipe(rename(`${post.slug}.html`))
        .pipe(gulp.dest('./build'));
}

buildPostPages();
