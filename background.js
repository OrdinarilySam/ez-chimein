const reqFilter = {
  urls: ["*://chimein2.cla.umn.edu/api/chime/*/openQuestions"],
};

function listener(details) {
  let filter = browser.webRequest.filterResponseData(details.requestId);
  const decoder = new TextDecoder("utf-8")
  const encoder = new TextEncoder()

  // filter.onstart = (event) => {
  //   console.log("started")
  // }
  let str = ""
  filter.ondata = (event) => {
    str += decoder.decode(event.data, {stream: true})
  };

  filter.onstop = (event) => {
    console.log("closing connection")
    const data = JSON.parse(str)
    for(const question in data.sessions) {
      const path = data.sessions[question].question.question_info.question_responses
      for(questionData in path){
        if(path[questionData].correct){
          data.sessions[question].question.question_info.question_responses[questionData].text = path[questionData].text.slice(0, -4) + " ✅</p>"
        }
      }
    }
    str = JSON.stringify(data)
    filter.write(encoder.encode(str))
    filter.disconnect()
  }

  filter.onerror = (event) => {
    console.log(filter.error);
  };


  return {};
}

browser.webRequest.onBeforeRequest.addListener(listener, reqFilter, ['blocking']);

console.log("extension started");
