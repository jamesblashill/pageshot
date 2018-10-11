var page = require("webpage").create();
var config = require("./config");

page.viewportSize = config.viewportSize;
page.customHeaders = config.customHeaders;

var loadStart = Date.now();
var loadEnd = Date.now();

var navigation = [];
page.navigationRequested = function(url, type) {
  navigation.push({
    url: url,
    type: type
  });
};

var resources = {};

page.onResourceRequested = function(request) {
  resources[request.id] = {
    id: request.id,
    url: request.url,
    start: Date.now()
  };
};

page.onResourceReceived = function(response) {
  resources[response.id].status = response.status;
  resources[response.id].end = Date.now();
  resources[response.id].bodySize = response.bodySize;
  loadEnd = Date.now();
};

page.onResourceTimeout = function(request) {
  resources[request.id].end = Date.now();
  resources[request.id].timedout = true;
  loadEnd = Date.now();
};

page.onResourceError = function(resourceError) {
  resources[resourceError.id].end = Date.now();
  resources[resourceError.id].error = true;
  resources[resourceError.id].errorCode = resourceError.errorCode;
  resources[resourceError.id].errorString = resourceError.errorString;
  loadEnd = Date.now();
};

var consoleMessages = [];
page.onConsoleMessage = function(message, lineNumber, sourceId) {
  consoleMessages.push({
    message: message,
    lineNumber: lineNumber,
    sourceId: sourceId,
    timestamp: Date.now()
  });
};

var errors = [];
page.onError = function(message, stackTrace) {
  errors.push({
    message: message,
    stackTrace: stackTrace
  });
  loadEnd = Date.now();
};

function reportPageShot() {
  var imageName = "screenshots/" + Date.now() + ".png";
  page.render(imageName);
  var pageShotReport = {
    loadStart: loadStart,
    loadEnd: loadEnd,
    pageUrl: config.pageUrl,
    viewportSize: config.viewportSize,
    customHeaders: config.customHeaders,
    imageName: imageName,
    resources: resources,
    navigation: navigation,
    consoleMessages: consoleMessages,
    errors: errors
  };
  console.log(JSON.stringify(pageShotReport, " ", 2));
}

function shootPage() {
  page.open(config.pageUrl, function(err) {
    if (err) {
      console.log(err);
      phantom.exit();
      return;
    }

    setTimeout(function() {
      reportPageShot();
      phantom.exit();
    }, 30000);
  });
}

shootPage();
