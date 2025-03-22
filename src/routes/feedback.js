const router = require("express").Router();
const { create, getFeedbackForAnEvent } = require("../controllers/feedback");

router.post("/", create);
router.post("/getFeedback", getFeedbackForAnEvent);

module.exports = router;