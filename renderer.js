/* 
Description: This file contains the logic for the renderer process. 
It listens for the form submission event and sends an HTTP POST request to the server. 
The server then forwards the request to the Ollama API and returns the response to the renderer process, 
which updates the UI with the generated text. 
*/

// listen for on click  from the form
function sendPrompt(event) {
    
    event.preventDefault();
    const prompt = document.getElementById('prompt').value;
    if (!prompt) {
        alert('Please enter a prompt');
        return;
    }
    const button = document.getElementById('sendButton');
    const spinner = document.getElementById('spinner');
    
    const model = document.getElementById('modelName').value;
    console.log('>>>>> model', model);
    button.disabled = true;
    spinner.style.display = 'inline-block';

    // send http post request to ollama api             
    fetch('http://localhost:11434/api/generate', { // TODO: refactor this main.js to have express server handle the call to ollama api
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify( { "prompt": prompt, "model": model, "stream": false } )
    })
        .then((response) => { 
            spinner.style.display = 'none';
            button.disabled = false;
            return response.json();
        })
        .then((data) => {
            console.log('>>>>> response', data.response);
            window.document.getElementById('response').innerHTML = data.response;
        })
        .catch((error) => {
            console.error('Error:', error);
        });




}