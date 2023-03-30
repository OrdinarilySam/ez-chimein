const reqFilter = {
  urls: ["*://chimein2.cla.umn.edu/api/chime/*/openQuestions"],
};

let answerData = []

function inListener(details) {
  let filter = browser.webRequest.filterResponseData(details.requestId);
  const decoder = new TextDecoder("utf-8");
  const encoder = new TextEncoder();


  let str = "";

  filter.ondata = (event) => {
    str += decoder.decode(event.data, { stream: true });
    filter.write(event.data)
  };

  filter.onstop = (event) => {
    const data = JSON.parse(str.trim())
    answerData = []
    for(const question in data.sessions){
      answerData.push([])
      const path = data.sessions[question].question.question_info.question_responses
      for(const questionData in path) {
        if (path[questionData].correct){
          answerData[question].push(questionData)
        }
      }
    }
    filter.disconnect()
  }


  filter.onerror = (event) => {
    console.log(filter.error);
    filter.disconnect()
  };

  return {};
}

browser.webRequest.onBeforeRequest.addListener(inListener, reqFilter, [
  "blocking",
]);

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.message === "answer_request"){
    sendResponse({response: answerData})
  }
})