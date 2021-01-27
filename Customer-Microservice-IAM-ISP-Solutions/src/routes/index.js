const customer = require("./customers");

module.exports = (router) => {
    customer(router);
    return router;
};