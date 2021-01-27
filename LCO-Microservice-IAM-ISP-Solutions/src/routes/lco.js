const addcontroller = require("../controllers/lco.add");
const getcontroller = require("../controllers/lco.getall");
const delcontroller = require("../controllers/lco.delete");
const putcontroller = require("../controllers/lco.update");
const { validateToken } = require("../../utils");

module.exports = (router) => {
    router.route("/lco").post(validateToken, addcontroller.add).get(validateToken, getcontroller.getAll); // This route will be protected


    router.route("/lco/:lcoId").delete(validateToken, delcontroller.delete).put(validateToken, putcontroller.update);
}