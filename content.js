const button = document.createElement('button');
button.innerText = 'O';
button.className = "reveal-btn switch-btn"
document.body.appendChild(button);
let isRevealed = false;

button.addEventListener("click", (event) => {
  if(isRevealed){
    isRevealed = !isRevealed
    button.innerText = "O"
    button.className = "reveal-btn switch-btn"
    document.querySelectorAll(".correct-answer").forEach(element => {
      element.classList.remove("correct-answer")
    })
  }else{
    isRevealed = !isRevealed
    button.innerText = "X"
    button.className = "hide-btn switch-btn"
    browser.runtime.sendMessage({message: "answer_request"})
      .then(response => {
        handleData(response.response)
      })
  }
})


function handleData(answerData) {
  if(answerData.length < 1) document.location.reload();
  const elements = document.querySelectorAll("article.participant-prompt")
  elements.forEach((element, index) => {
    const options = element.childNodes[1].childNodes[0].childNodes[0].children
    let selected = false
    answerData[index].forEach((answer) => {
      if(!selected){
        options[answer].children[0].click()
        selected = true
      }
      options[answer].children[1].className += " correct-answer"
    })
  })
}