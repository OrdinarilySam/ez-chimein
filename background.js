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
  };

  filter.onstop = (event) => {
    filter.write(encoder.encode(str))
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


// const sendFilter = {
//   urls: ["*://chimein2.cla.umn.edu/api/chime/*/session/*/response*"]
// }

// let observer

// function elementsLoaded() {

//   return new Promise(resolve => {
//     const elements = document.querySelectorAll(".participant-prompt")
//     if(elements.length > 0){
//       console.log("resolving early")
//       resolve(elements)
//     } else {
//       console.log("going to observer")
//       observer = new MutationObserver((mutations) => {
//         console.log("mutations made")
//         const newNodes = mutations.reduce( (acc, mutation) => {
//           acc.push(...mutation.addedNodes)
//           return acc
//         }, []).filter(element => {
//           return element.matches && element.matches(".participant-prompt")
//         })
//         console.log(newNodes)
//         if(newNodes.length > 0){
//           resolve(newNodes)
//           observer.disconnect()
//         }
//       })
//       observer.observe(document.documentElement, {childList: true, subtree: true})
//     }
//   })
// }


  // filter.onstop = (event) => {
  //   const data = JSON.parse(str);
  //   if(details.url.endsWith("openQuestions")){
  //     for (const question in data.sessions) {
  //       const path =
  //         data.sessions[question].question.question_info.question_responses;
  //       for (questionData in path) {
  //         if (path[questionData].correct) {
  //           data
  //             .sessions[question]
  //             .question
  //             .question_info
  //             .question_responses[questionData]
  //             .text = path[questionData].text.slice(0, -4) + " ✅</p>";
  //         }
  //       }
  //     }
  //     str = JSON.stringify(data);
  //     filter.write(encoder.encode(str));
  //   } else {
  //     console.log(str)
  //   }
  //   filter.disconnect();
  // };

// function onPageLoaded() {
//   return new Promise((resolve)=> {
//     if(document.readyState == "complete"){
//       return resolve()
//     } else {
//       window.addEventListener('load', resolve)
//     }
//   })
// }

// function outListener(details) {
//   const decoder = new TextDecoder("utf-8");
//   const encoder = new TextEncoder();

//   if (details.method !== "PUT") return;
//   let filter = browser.webRequest.filterResponseData(details.requestId);
  
//   let str = "";
//   filter.ondata = (event) => {
//     str += decoder.decode(event.data, { stream: true });
//   };

//   filter.onstop = (event) => {
//     const data = JSON.parse(str);
    
//     // Remove the checkmark from the selected answer
//     console.log(data)
//     if(data.response_info.choice.endsWith(" ✅</p>")){
//       data.response_info.choice = data.response_info.choice.slice(0, -6) + "</p>"
//     }
//     // data.response.text = selectedAnswer;

//     str = JSON.stringify(data);
//     filter.write(encoder.encode(str));
//     filter.disconnect();
//   };
  
//   filter.onerror = (event) => {
//     console.log(filter.error);
//   };
    
//   return {};
// }

// browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   // Check if the URL matches the desired pattern
//   if (tab.url && tab.url.startsWith("https://chimein2.cla.umn.edu")) {
//     // Call elementsLoaded() function
//     console.log("called")
//     elementsLoaded()
//       .then((element) => {
//         console.log("promise resolved")
//         const elements = document.querySelectorAll("article.participant")
//         console.log(elements)
//       })
//       .catch(error => console.log(error))
//   }
// });


// function waitForElementToDisplay() {
//   return new Promise(function (resolve, reject) {
//     console.log("1")
//     var observer = new MutationObserver (function (mutations) {
//       console.log("4")
//       mutations.forEach(function (mutation) {
//         console.log("5")
//         var newNodes = mutation. addedNodes;
//         if (newNodes.length > 0) {
//           console.log("6")
//           var element = document. queryselector (' •tab-pane.container.active label. form-check-label');
//           if (element) {
//             console.log("7")
//             observer.disconnect();
//             resolve(element);
//           }
//         }
//       });
//     }) 
//     console.log("2")
//     observer.observe(document.body, { childList: true, subtree: true });
//     console.log("3")
//   });
// }




// onPageLoaded()
//   .then(() => {
//     const elements = document.querySelectorAll(".form-check-label")
//     console.log(elements)
//   })
//   .catch(error => console.log(error))



// elementsLoaded(".form-check-label")
//   .then((elements) => console.log(elements))

// browser.webRequest.onBeforeSendHeaders.addListener(outListener, sendFilter, [
//   "blocking", "requestHeaders"
// ])


