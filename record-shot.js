const fs = require("fs");
const { exec, mkdir } = require("shelljs");
const PageShot = require("./page-shot");
const _ = require("lodash");

const reportsPath = __dirname + "/reports";

module.exports = function() {
  exec("phantomjs shoot-page.js", function(code, stdout, stderr) {
    mkdir("-p", reportsPath);
    const report = JSON.parse(stdout.split("#####")[0]);
    let resourceErrors = 0;
    _.forEach(report.resources, resource => {
      if (resource.error || resource.timedout) {
        resourceErrors++;
      }
    });

    PageShot.create({
      url: report.pageUrl,
      duration: report.loadEnd - report.loadStart,
      errors: report.errors.length + resourceErrors,
      resources: _.size(report.resources)
    }).then(result => {
      const reportId = result.lastInsertedId;
      const reportFilePath = `${reportsPath}/${reportId}.json`;
      fs.writeFileSync(reportFilePath, JSON.stringify(report, " ", 2));
      console.log(`[${Date.now()}] Wrote ${reportFilePath}`);
    });
  });
};
