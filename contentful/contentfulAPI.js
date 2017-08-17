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

const getCategories = (categoryObject) => {
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

exports.flattenLists = (contentType, field, id) => {
    var flattened = {};
    client.getEntries({
        content_type: contentType,
        linking_field: field,
        target_entry_id: id
    }).then(function(data) {
        for (var key in data) {
            flattened[key] = data[key];
        }
    }).catch(console.log)
    return flattened;
}

exports.extractPostInfo = (post) => {
    var postInfo = {};
    postInfo.title = post.fields.title;
    postInfo.slug = post.fields.slug;
    postInfo.body = markdown.toHTML(post.fields.body);
    postInfo.categories = getCategories(post.fields.category);
    postInfo.author = getAuthorInfo(post.fields.author[0]); // Assumes posts only have one author
    return postInfo;
}

exports.client = client;

//
// exports.getEntry = async (id) => {
//     try {
//         return await client.getEntry(id);
//     }
//     catch (err) {
//         console.log(err);
//     }
// }
// exports.getAllEntries = async () => {
//     try {
//         return await client.getEntries();
//     }
//     catch (err) {
//         console.log(err);
//     }
// }
// exports.getLinkedItems = async (typeID, linkOn, targetID) => {
//     try {
//         return await client.getEntries({
//             content_type: typeID,
//             linking_field: linkOn,
//             target_entry_id: targetID
//         });
//     }
//     catch (err) {
//         console.log(err);
//     }
// }
// exports.getCategory = async (typeID, category) => {
//     try {
//         return await client.getEntries({
//             content_type: typeID,
//             "sys.fields.category": category
//         });
//     }
//     catch (err) {
//         console.log(err);
//     }
// }
// exports.search = async (queryTerm) => {
//     try {
//         return await client.getEntries({
//             query: queryTerm
//         });
//     }
//     catch (err) {
//         console.log(err);
//     }
// }
