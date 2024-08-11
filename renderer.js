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
    console.log('>>>>> prompt', prompt);
    // send http post request to ollama api
    fetch('http://localhost:11434/api/generate', { // TODO: refactor this main.js to have express server handle the call to ollama api
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify( { "prompt": prompt, "model": "mistral", "stream": false } )
    })
        .then((response) => { 
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