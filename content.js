const rhButton = document.createElement('button');
const sButton = document.createElement('button')
rhButton.innerText = 'O';
rhButton.className = "reveal-btn switch-btn"
sButton.innerText = "#"
sButton.className = "select-btn switch-btn"
document.body.appendChild(rhButton);
document.body.appendChild(sButton)
let isRevealed = false;
let answerData = []

rhButton.addEventListener("click", (event) => {
  if(isRevealed){
    isRevealed = !isRevealed
    rhButton.innerText = "O"
    rhButton.className = "reveal-btn switch-btn"
    document.querySelectorAll(".correct-answer").forEach(element => {
      element.classList.remove("correct-answer")
    })
  }else{
    isRevealed = !isRevealed
    rhButton.innerText = "X"
    rhButton.className = "hide-btn switch-btn"
    handleModifications(true)
}})

sButton.addEventListener("click", (event) => {
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