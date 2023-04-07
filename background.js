const reqFilter = {
  urls: ["*://chimein2.cla.umn.edu/api/chime/*/openQuestions"],
};

let answerData = [];

function inListener(details) {
  // event listener for when a new request is being made
  let filter = browser.webRequest.filterResponseData(details.requestId);

  // data gets decoded and added to the string and writes it back to the page
  let str = "";
  filter.ondata = (event) => {
    str += new TextDecoder("utf-8").decode(event.data, { stream: true });
    filter.write(event.data);
  };

  // after data is done being received it stores the correct answers
  filter.onstop = (event) => {
    const data = JSON.parse(str.trim());
    answerData = [];
    for (const question in data.sessions) {
      // creates an array of arrays for storing the question answer data
      answerData.push([]);
      const path =
        data.sessions[question].question.question_info.question_responses;
      for (const questionData in path) {
        if (path[questionData].correct) {
          answerData[question].push(questionData);
        }
      }
    }
    filter.disconnect();
  };

  filter.onerror = (event) => {
    console.log(filter.error);
    filter.disconnect();
  };

  return {};
}

// creates a listener with the provided "reqFilter" url
browser.webRequest.onBeforeRequest.addListener(inListener, reqFilter, [
  "blocking",
]);

// listens for a message from the content script and replies with the answer data
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.message === "answer_request") {
    sendResponse({ response: answerData });
  }
});
