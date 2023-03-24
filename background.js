const reqFilter = {
  urls: ["*://chimein2.cla.umn.edu/api/chime/*/openQuestions"],
};

function listener(details) {
  let filter = browser.webRequest.filterResponseData(details.requestId);

  filter.onstart = (event) => {
    console.log("start called");
    console.log(event.data);
  };

  const data = [];
  filter.ondata = (event) => {
    console.log("data called");
    data.push(event.data);
    filter.disconnect();
  };

  filter.onerror = (event) => {
    console.log(filter.error);
  };

  console.log("at the end");
  return {};
}

browser.webRequest.onBeforeSendHeaders.addListener(listener, reqFilter, [
  "requestHeaders",
]);

console.log("extension started");
