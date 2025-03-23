/* eslint-disable linebreak-style */
"use strict";

const SettingModel = require("../models/Setting");


const get = async (req, res) => {
  try {

    const { setting } = req.params;

    if(!setting){
      return res.status(404).json({
        status: 400,
        message: "Bad request!",
      });
    }

    let settings = await SettingModel.findOne();

    if (!settings) {
      return res.status(404).json({
        status: 404,
        message: "Not Found. No settings was found in db",
      });
    }

    if(settings[setting]){
      return res.json({
        status: 200,
        message: "Success",
        data: settings[setting],
      });
    }
    return res.json({
      status: 404,
      message: "No setting found with the given name",
    });

  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};


const getAll = async (req, res) => {
  try {
    let settings = await SettingModel.findOne();

    if (!settings) {
      settings = await SettingModel.create({ title: "Utsav 2024", editTeamEnabled: false });
      await settings.save();
    }

    return res.json({
      status: 200,
      message: "Success",
      data: settings,
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

const updateSettings = async (req, res) => {
  
  let { title, editTeamEnabled, downloadCertificateEnabled } = req.body;
  if( title === null || editTeamEnabled === null || downloadCertificateEnabled === null) {
    return res.status(404).json({
      status: 400,
      message: "Bad request",
    });
  }

  if(title == "") title = "MUCAPP";

  let setting = await SettingModel.findOne();
  if(!setting){ // Setting doesn't exist, create it
    setting = await SettingModel.create({
      title: title,
      editTeamEnabled: editTeamEnabled,
      downloadCertificateEnabled: downloadCertificateEnabled,
    });
  }else{
    setting.title = title;
    setting.editTeamEnabled = editTeamEnabled;
    setting.downloadCertificateEnabled = downloadCertificateEnabled;
    await setting.save();
  }

  return res.json({
    status: 200,
    message: "Success",
    setting: setting,
  });
};

module.exports = {
  get,
  getAll, 
  updateSettings,
};
