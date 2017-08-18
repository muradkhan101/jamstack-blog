const contentful = require('contentful');
const config = require('./config.json');
const markdown = require('markdown').markdown;

const typeId = {
    author: "1kUEViTN4EmGiEaaeC6ouY",
    category: "5KMiN6YPvi42icqAUQMCQe",
    comment: "comment",
    post: "2wKn6yEnZewu2SCCkus4as",
    user: "user"
}

var client = contentful.createClient({
    accessToken: config.accessToken,
    space: config.space
});

const getPhotoFromAuthor = (author) => {
    var photoObj = author.fields.profilePhoto.fields.file.url;
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

const getAuthorInfo = (authorObj) => {
    var author = {};
    author.name = authorObj.fields.name;
    author.biography = authorObj.fields.biography;
    // author.socialLinks = getSocialLinks(authorObj.fields.socialLinks);
    author.photo = getPhotoFromAuthor(authorObj);
    return author;
}

const getAllPosts = () => {
    return client.getEntries({
        content_type: '2wKn6yEnZewu2SCCkus4as',
        include: 3
    })
}

const getRecentPosts = (limit) => {
    return client.getEntries({
        order: '-sys.createdAt,sys.id',
        content_type: '2wKn6yEnZewu2SCCkus4as',
        limit: 10
    }).then(function(data){
        var recentPosts = [];
        for (var i = 0; i < data.items.length; i++) {
            recentPosts.push(extractPostInfo(data.items[i]))
        }
        return recentPosts;
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
    postInfo.body = markdown.toHTML(post.fields.body);
    postInfo.summary = postInfo.body.slice(0, 255) + '...';
    postInfo.categories = extractCategories(post.fields.category);
    postInfo.author = getAuthorInfo(post.fields.author[0]); // Assumes posts only have one author
    return postInfo;
}

module.exports = {
    "client": client,
    "flattenLists": flattenLists,
    "getRecentPosts": getRecentPosts,
    "getAllPosts": getAllPosts,
    "extractPostInfo": extractPostInfo
}
