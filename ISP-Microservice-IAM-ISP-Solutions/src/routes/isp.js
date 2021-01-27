const addcontroller = require("../controllers/isp.add");
const getcontroller = require("../controllers/isp.getall");
const delcontroller = require("../controllers/isp.delete");
const putcontroller = require("../controllers/isp.update");
const { validateToken } = require("../../utils");


module.exports = (router) => {
    router.route("/isp").post(validateToken, addcontroller.add).get(validateToken, getcontroller.getAll); // This route will be protected


    router.route("/isp/:ispId").delete(validateToken, delcontroller.delete).put(validateToken, putcontroller.update);
    //router.route("/login").post(controller.login);
};