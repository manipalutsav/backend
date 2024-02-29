const { response } = require("../utils/constants");
const User = require("../models/User");
const twilio = require('twilio');
const Notification = require("../models/Notification");

let client = null;
if(process.env.TWILIO_ACCOUNT_SID)
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendToMe = async (req, res) => {
  try {

    let { date, day, wishTime, whatsapp, sms, push, email } = req.body;

    if (!date) {
      return res.json(response(400, "Date is missing"));
    }

    if (!day) {
      return res.json(response(400, "Day is missing"));
    }

    if (!wishTime) {
      return res.json(response(400, "wish time is missing"));
    }


    let message =
      `Good ${wishTime} ${req.user.name},
_This is a message from MAHE CCC._
*Welcome to UTSAV! Day ${day} - ${date}*

We are sending this message to remind you of all the events that's going to take place today.
Please ensure all participants are at the venure 15 mins before the event starts.

Please click on the link to see today's events:
https://manipalutsav.com/events/public?date=${date}`

    let mobile = req.user.mobile;
    if (!mobile)
      return res.json(response(404, "Could not find user mobile number"))
    if (mobile.length == 10)
      mobile = `+91${mobile}`

    await client.messages
      .create({
        body: message,
        from: 'whatsapp:+19034763176',
        to: `whatsapp:${mobile}`
      });
    let notification = await Notification.create({
      message,
      whatsapp, sms, push, email,
      author: req.user._id,
      timestamp: Date.now(),
      whatsappCount: 1
    })
    res.json(response(200, notification));
  }
  catch (err) {
    console.error(err);
    res.json(response(500, err));;
  }
};

const sendToAllCoOrdinators = async (req, res) => {
  try {
    let { date, day, wishTime, whatsapp, sms, push, email } = req.body;

    if (!date) {
      return res.json(response(400, "Date is missing"));
    }

    if (!day) {
      return res.json(response(400, "Day is missing"));
    }

    if (!wishTime) {
      return res.json(response(400, "wish time is missing"));
    }

    let coOrdinators = await User.find({ type: { $in: [4, 8] } });

    await Promise.all(coOrdinators.map(coOrdinator => {
      let user = coOrdinator.toObject();
      let message =
        `Good ${wishTime} ${user.name},
_This is a message from MAHE CCC._
*Welcome to UTSAV! Day ${day} - ${date}*

We are sending this message to remind you of all the events that's going to take place today.
Please ensure all participants are at the venure 15 mins before the event starts.

Please click on the link to see today's events:
https://manipalutsav.com/events/public?date=${date}`

      let mobile = user.mobile || user.phoneNumber;;
      if (!mobile)
        return true;
      if (mobile.length == 10)
        mobile = `+91${mobile}`

      return client.messages
        .create({
          body: message,
          from: 'whatsapp:+19034763176',
          to: `whatsapp:${mobile}`
        });
    }));


    let message =
      `Good ${wishTime} {{user}},
_This is a message from MAHE CCC._
*Welcome to UTSAV! Day ${day} - ${date}*

We are sending this message to remind you of all the events that's going to take place today.
Please ensure all participants are at the venure 15 mins before the event starts.

Please click on the link to see today's events:
https://manipalutsav.com/events/public?date=${date}`

    let notification = await Notification.create({
      message,
      whatsapp, sms, push, email,
      author: req.user._id,
      timestamp: Date.now(),
      whatsappCount: coOrdinators.length
    })
    res.json(response(200, notification));
  }
  catch (err) {
    console.error(err);
    res.json(response(500, err));;
  }
};

const getLog = async (req, res) => {
  try {

    let notifications = await Notification.find().populate({
      path: "author",
      model: "User",
    });
    res.json(response(200, notifications));
  }
  catch (err) {
    console.error(err);
    res.json(response(500, err));;
  }
};


module.exports = {
  sendToMe,
  sendToAllCoOrdinators,
  getLog
}
