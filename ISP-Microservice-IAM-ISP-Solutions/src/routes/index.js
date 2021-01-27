const isp = require("./isp");

module.exports = (router) => {
    isp(router);
    return router;
};