const contentful = require('contentful');
const config = require('./config.json');
const marked = require('marked');

const typeId = {
    author: "1kUEViTN4EmGiEaaeC6ouY",
    category: "5KMiN6YPvi42icqAUQMCQe",
    comment: "comment",
    post: "2wKn6yEnZewu2SCCkus4as",
    user: "user"
}

var client = contentful.createClient(config);

const getPhotoFromAuthor = (author) => {
    var photoObj = 'http:' + author.fields.profilePhoto.fields.file.url;
    if (photoObj !== undefined) {
        return photoObj;
    } else return "insert blank photo";
}

const extractCategories = (categoryObject) => {
    var categories = [];
    if (categoryObject) {
        for (var i = 0; i < categoryObject.length; i++) {
            categories.push(categoryObject[0].fields.title);
        }
    } else return ["No categories"];
    return categories;
}

const makeSocialArray = (json) => {
  socialArray = [];
  for (let link in json) {
    socialArray.push(json[link])
  }
  return socialArray;
}

const getAuthorInfo = (authorObj) => {
    var author = {};
    author.name = authorObj.fields.name;
    author.biography = authorObj.fields.biography;
    author.socialMedia = makeSocialArray(authorObj.fields.socialMedia);
    author.photo = getPhotoFromAuthor(authorObj);
    return author;
}

const getAllPosts = () => {
    return client.getEntries({
        content_type: typeId.post,
        include: 3
    })
}

const getRecentPosts = (limit) => {
    return client.getEntries({
        order: '-sys.createdAt,sys.id',
        content_type: typeId.post,
        limit: 10
    }).then(function(data){
        var recentPosts = [];
        for (var i = 0; i < data.items.length; i++) {
            recentPosts.push(extractPostInfo(data.items[i]))
        }
        return recentPosts;
    })
}
const search = (query) => {
  return client.getEntries({
    'query': query
  }).then(function (data) {
    var posts = [];
    for (let i = 0; i < data.items.length; i++) {
        posts.push(contentful.extractPostInfo(data.items[i]));
    }
    return posts;
  })
}
const flattenLists = (contentType, field, id) => {
    client.getEntries({
        content_type: contentType,
        linking_field: field,
        target_entry_id: id
    }).then(function(data) {
        var flattened = {};
        for (var key in data) {
            flattened[key] = data[key];
        }
        return flattened;
    }).catch(console.log)
}

const extractPostInfo = (post) => {
  var postInfo = {};
  postInfo.title = post.fields.title;
  postInfo.slug = post.fields.slug;
  postInfo.body = marked(post.fields.body);
  postInfo.summary = (postInfo.body.slice(0, 255) + '...').replace(/<.+?>/g, ' ');
  postInfo.categories = extractCategories(post.fields.category);
  postInfo.tags = post.fields.tags;
  if (post.fields.author) postInfo.author = getAuthorInfo(post.fields.author[0]); // Assumes posts only have one author
  postInfo.isPost = post.fields.isPost;
  postInfo.date = post.fields.date;
  return postInfo;
}

module.exports = {
    client,
    flattenLists,
    getRecentPosts,
    getAllPosts,
    extractPostInfo,
    typeId,
    search
}
