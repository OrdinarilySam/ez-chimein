const button = document.createElement('button');
button.innerText = 'Reveal';
button.style.position = 'fixed';
button.style.top = '0';
button.style.left = '0';
document.body.appendChild(button);


button.addEventListener("click", (event) => {
  browser.runtime.sendMessage({message: "question_request"}, (response) => {
    
  })
})