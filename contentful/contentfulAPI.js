const contentful = require('contentful');
const config = require('./config.json');

var client = contentful.createClient({
    accessToken: config.accessToken,
    space: config.space
});

exports.getEntry = (id, cb) => {
    client.getEntry(id)
    .then((response) => cb(response))
    .catch(console.error)
}
exports.getAllEntries = (cb) => {
    client.getEntries()
    .then((response) => cb(response.items))
    .catch(console.error)
}
exports.getLinkedItems = (typeID, linkOn, targetID, cb) => {
    client.getEntries({
        content_type: typeID,
        linking_field: linkOn,
        target_entry_id: targetID
    })
    .then((response) => cb(response.items))
    .catch(console.error)
}
exports.getCategory = (typeID, category, cb) => {
    client.getEntries({
        content_type: typeID,
        "sys.fields.category": category
    })
        .then((response) => cb(response.items))
        .catch(console.error)
}
exports.search = (queryTerm, cb) => {
    client.getEntries({
        query: queryTerm
    })
        .then((response) => cb(response.items))
        .catch(console.error)
}