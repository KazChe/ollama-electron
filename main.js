const { app, BrowserWindow } = require('electron');
const express = require('express');
const bodyParser = require('body-parser');
const jsonStream = require('stream-json/streamers/StreamValues');
const { ipcRenderer } = require('electron');

// handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

let mainWindow;
let server;

function createServer() {
  const app = express();
  app.use(bodyParser.json());

  let responseStream = new jsonStream.Transform({ objectMode: true });

  // handle call to ollama api
  app.post('/api/generate', (req, res) => {
    const request = req.body;
    console.log('>>>>> request',request);
    // responseStream.push(JSON.stringify(request));
    // responseStream.pipe(res);
    fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {"prompt": JSON.stringify(request), "model": "mistral", "stream": false }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('>>>>> response', data);
        res.send(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });

  
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 970,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile('index.html');

  ipcRenderer.on('response', (event, message) => {
    console.log(message);
    mainWindow.webContents.send('setResponse', message);
  });
}

app.whenReady().then(() => {
  createServer();
  createWindow();
});
