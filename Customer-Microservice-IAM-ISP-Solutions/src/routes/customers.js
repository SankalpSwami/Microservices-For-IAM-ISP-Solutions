const addcontroller = require("../controllers/customers.add");
const getcontroller = require("../controllers/customers.getall");
const delcontroller = require("../controllers/customers.delete");
const putcontroller = require("../controllers/customers.update");
const { validateToken } = require("../../utils");

module.exports = (router) => {
    router.route("/customers").post(validateToken, addcontroller.add).get(validateToken, getcontroller.getAll); // This route will be protected


    router.route("/customers/:customerId").delete(validateToken, delcontroller.delete).put(validateToken, putcontroller.update);
};