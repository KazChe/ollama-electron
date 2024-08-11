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

  app.post('/api/generate', (req, res) => {
    const request = req.body;
    console.log('>>>>> request',request);
    responseStream.push(request);
    responseStream.pipe(res);
  });

  server = app.listen(11434, () => {
    console.log(`Ollama API listening on http://localhost:${server.address().port}`);
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
