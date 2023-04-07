const rhButton = document.createElement('button');
const sButton = document.createElement('button')
const div = document.createElement('div')

rhButton.innerText = 'R';
rhButton.className = "reveal-btn switch-btn"

sButton.innerText = "S"
sButton.className = "select-btn switch-btn"

div.className = "btn-container-div"

div.appendChild(rhButton);
div.appendChild(sButton)

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