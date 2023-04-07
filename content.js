
// rh button is the reveal/hide answers button
const rhButton = document.createElement('button');
rhButton.innerText = 'O';
rhButton.className = "reveal-btn switch-btn"

// s button is the select answer button
const sButton = document.createElement('button')
sButton.innerText = "#"
sButton.className = "select-btn switch-btn"

// div contains the buttons and puts them in the top left of the screen
const div = document.createElement('div')
div.className = "btn-container-div"
div.appendChild(rhButton);
div.appendChild(sButton)

document.body.appendChild(div)

let isRevealed = false;
let answerData = []

rhButton.addEventListener("click", () => {
  // toggles between revealing and hiding the correct answers
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

sButton.addEventListener("click", () => {
  handleModifications(false)
})

async function retreiveData() {
  // sends a message to the background script requesting the data
  response = await browser.runtime.sendMessage({message: "answer_request"})

  if(response.response.length < 1){
    document.location.reload();
  }else{
    answerData = response.response
    return answerData
  }
}

async function handleModifications(reveal) {
  // retrieves the correct answer data and 
  // 1. reveals the correct answers if reveal is true
  // 2. selects the first correct answer if reveal is false

  // data is an array of arrays
  const data = await retreiveData()
  if(!data || data.length < 1) return;

  // this is the top level query that contains each of the radio inputs
  const elements = document.querySelectorAll("fieldset.form-group")
  elements.forEach((element, index) => {
    const options = element.children

    if(reveal){
      // adds the appropriate class to each correct answer
      data[index].forEach(answer => {
        options[answer].children[1].className += " correct-answer"
      })
    }else{
      // clicks the first correct answer
      options[data[index][0]].children[0].click()
    }
  })
}