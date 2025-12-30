const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const isDev = !app.isPackaged;

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#0f172a',
            symbolColor: '#94a3b8',
            height: 35
        },
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        backgroundColor: '#0f172a',
        show: false
    });

    if (isDev) {
        win.loadURL('http://localhost:5173');
        win.webContents.openDevTools();
    } else {
        win.loadFile(path.join(__dirname, 'dist/index.html'));
    }

    win.once('ready-to-show', () => {
        win.show();
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('run-script', (event, scriptName) => {
    const scriptPath = path.join(__dirname, '..', scriptName);
    let child;

    if (scriptName.endsWith('.ps1')) {
        child = spawn('powershell.exe', ['-ExecutionPolicy', 'Bypass', '-File', scriptPath]);
    } else if (scriptName.endsWith('.bat')) {
        child = spawn('cmd.exe', ['/c', scriptPath]);
    }

    child.stdout.on('data', (data) => {
        event.reply('script-output', data.toString());
    });

    child.stderr.on('data', (data) => {
        event.reply('script-output', `ERROR: ${data.toString()}`);
    });

    child.on('close', (code) => {
        event.reply('script-output', `\nProcess exited with code ${code}\n`);
        event.reply('script-finished', code);
    });
});
