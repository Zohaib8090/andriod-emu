const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    runScript: (scriptName) => ipcRenderer.send('run-script', scriptName),
    onScriptOutput: (callback) => ipcRenderer.on('script-output', (_event, value) => callback(value)),
    onScriptFinished: (callback) => ipcRenderer.on('script-finished', (_event, value) => callback(value)),
});
