const dbHelpers = require('./dbHelpers');

async function getItems(req, res, next) {
    const items = await dbHelpers.getItems(next);
    if (items) {
        res.render("product/list", {
            list: items
        })
        return;
    }
}

async function sortByPrice(query, req, res, next) {
    // const items = await dbHelpers.getItems;
    // if (query == "price-low-high") {
    //     return items.sort({price:1}).lean();
    // }
    // else {
    //     return items.sort({price:-1}).lean();
    // }
}

function sortByName() {

}

module.exports = {
    getItems,
    sortByPrice,
    sortByName
};