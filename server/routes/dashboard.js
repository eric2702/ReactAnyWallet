const router = require("express").Router();
const authorization = require("../middleware/authorization");
const dashboardController = require("../controllers/dashboard");

router.get("/", authorization, dashboardController.getRoot);
router.post("/", authorization, dashboardController.postTransaction);
router.get("/user_id", authorization, dashboardController.getUserId);
router.get("/get_trans", authorization, dashboardController.getTransaction);

module.exports = router;
