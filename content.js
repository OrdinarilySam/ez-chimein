const button = document.createElement('button');
button.innerText = 'Reveal';
button.style.position = 'fixed';
button.style.top = '0';
button.style.left = '0';
document.body.appendChild(button);

button.addEventListener("click", (event) => {
  console.log("clicked")
  browser.runtime.sendMessage({message: "answer_request"})
    .then(response => handleData(response.response))
})


function handleData(answerData) {
  const elements = document.querySelectorAll("article.participant-prompt")
  const toAdd = " ✅"
  elements.forEach((element, index) => {
    const options = element.childNodes[1].childNodes[0].childNodes[0].children
    answerData[index].forEach((answer) => {
      options[answer].children[1].innerText += toAdd
    })
  })
}