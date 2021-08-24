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
    const items = await dbHelpers.sortItemsPrice(query, next);
    if (items) {
        res.render("product/list", {
            list: items
        })
        return;
    }
}


async function sortByName(req, res, next) {
    const items = await dbHelpers.sortItemsName(next);
    if (items) {
        res.render("product/list", {
            list: items
        })
        return;
    }
}


async function searchItems(query, req, res, next) {
    const items = await dbHelpers.searchItemsName(query, next);
    if (items) {
        res.render("product/list", {
            list: items
        })
        return;
    }
}


async function filterItems(filter, value, req, res, next) {
    if (isNaN(value) || value.length == 0) {
        res.redirect('/');
    }
    
    const items = await dbHelpers.filterItemsList(filter, value, next);
    if (items) {
        res.render("product/list", {
            list: items
        })
        return;
    }
}

module.exports = {
    getItems,
    sortByPrice,
    sortByName,
    searchItems,
    filterItems
};