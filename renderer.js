/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
// listen for on click  from the form
function sendPrompt(event) {
    event.preventDefault();
    const prompt = document.getElementById('prompt').value;
    console.log('>>>>> prompt', prompt);
    // send http post request to ollama api
    fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ prompt }),
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