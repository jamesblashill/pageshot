const fs = require("fs");
const { exec, mkdir } = require("shelljs");
const PageShot = require("./page-shot");
const _ = require("lodash");

const reportsPath = __dirname + "/reports";

exec("phantomjs shoot-page.js", function(code, stdout, stderr) {
  mkdir("-p", reportsPath);
  const report = JSON.parse(stdout);
  PageShot.create({
    url: report.pageUrl,
    duration: report.loadEnd - report.loadStart,
    errors: report.errors.length,
    resources: _.size(report.resources)
  }).then(result => {
    const reportId = result.lastInsertedId;
    const reportFilePath = `${reportsPath}/${reportId}.json`;
    fs.writeFileSync(reportFilePath, JSON.stringify(report, " ", 2));
    console.log(`Wrote ${reportFilePath}`);
  });
});
