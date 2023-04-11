const express = require("express");
const router = express.Router();


const Notification = require("../controllers/notifications");

router.post("/sendToMe", Notification.sendToMe);
router.post("/sendToAllCoOrdinators", Notification.sendToAllCoOrdinators);
router.get("/log", Notification.getLog);

module.exports = router;