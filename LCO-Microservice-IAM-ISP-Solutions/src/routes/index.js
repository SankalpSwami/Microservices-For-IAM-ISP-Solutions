const lco = require("./lco");

module.exports = (router) => {
    lco(router);
    return router;
};