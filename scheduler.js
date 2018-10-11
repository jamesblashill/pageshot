var schedule = require("node-schedule");
var config = require("./config");
var recordShot = require("./record-shot");

module.exports = {
  start: function() {
    console.log("Starting scheduler");
    schedule.scheduleJob(config.schedule, recordShot);
  },
  runNow: recordShot
};
