const PracticeSlotModel = require("../models/PracticeSlot");
const CollegeModel = require("../models/College");


const createPracticeSlot = async (req, res) => {
  let colleges = await CollegeModel.find();

  let count = colleges.length;
  let slots = [];
  for (let i = 0; i < count; i++) {
    let index = Math.floor(Math.random() * 100) % colleges.length;
    let college = colleges.splice(index, 1)[0].toObject();
    let order = i + 1;
    try {
      await PracticeSlotModel.create({
        number: order,
        college: college._id
      });
    } catch (e) {
      throw e;
    }
    slots.push({ number: order, ...college });
  }
  return res.json({
    status: 200,
    message: "Success",
    data: slots,
  });
};

const getPracticeSlots = async (req, res, next) => {
  console.log(2);
  let slots = await PracticeSlotModel.find().populate('college');
  if (!slots) next();
  slots = slots.map(slot => ({
    id: slot.id,
    number: slot.number,
    ...slot.college.toObject(),
  }));

  return res.json({
    status: 200,
    message: "Success",
    data: slots,
  });
};


const deletePracticeSlots = async (req, res) => {
  await PracticeSlotModel.deleteMany();
  return res.json({
    status: 200,
    message: "Success",
  });
};

module.exports = {
  createPracticeSlot,
  getPracticeSlots,
  deletePracticeSlots
}